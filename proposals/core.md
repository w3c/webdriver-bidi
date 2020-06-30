# WebDriver BiDi Core Functionality

## Protocol

A protocol and transport layer for bidirectional WebDriver should support the following usage patterns:

- Command/response pattern for simple actions like querying a target's URL.
- Command/response/event pattern for starting a long-running operation and receiving progress updates (e.g. navigation).
- Registering for async events not associated with a particular command. Useful for listening to DOM events or new targets/contexts, etc.

The protocol should also be:

- Easy to write client-side libraries for.
- Easy to document.
- Interoperable with the existing WebDriver REST-style API.

### Transport Layer

The proposed transport mechanism is WebSockets. They support the full-duplex communication that we'll need for bidirectional WebDriver scenarios, and have broad library support in multiple languages.

The proposed message format is based on [JSON-RPC 2.0](https://www.jsonrpc.org/specification), but without the "jsonrpc" property and a different error message format. The proposed message format also adds additional "to" and "from" properties to assist with message routing. Unfortunately, existing JSON-RPC libraries will likely not work with WebDriver BiDi, but could likely be made to work with minor changes.

JSON-RPC is also accompanied by the [OpenRPC](https://open-rpc.org/) spec; an interface description format for JSON-RPC APIs that is both human and machine-readable. Using OpenRPC, we can document and describe the entire bidirectional WebDriver API, and also make it simple for clients to generate language bindings and keep them up to date. OpenRPC is recommended over OpenAPI because OpenRPC is designed specifically with JSON-RPC in mind. OpenAPI is designed to specify REST-style APIs, and so isn't as well suited to a JSON-RPC API. The OpenRPC maintainers provide tools to generate human-readable documentation and typings/bindings for various languages.

>[RESOLUTION](https://www.w3.org/2019/09/20-webdriver-minutes.html#resolution04): research having a more formalized schema for defining the transport layer

### High-Level Interface

A simple approach for adding bidirectional communication is to keep using the existing endpoints for command/response calls, and use the WebSocket transport only for browser-to-client notifications. This requires the fewest changes to existing WebDriver implementations, but it requires the client to speak both HTTP and WebSocket. Naturally, there will be lots of existing HTTP-based automation that may want to adopt some new bidi features, so WebDriver should at least allow mixing HTTP and WebSocket messages to support this scenario. However, we should offer clients the ability to do everything using the JSON-RPC dialect if they are able.

Exposing all of WebDriver's functionality via JSON-RPC has a few advantages. The API is more consistent, the client only needs to speak one dialect, and it is easier to reason about the order or messages when they are all going over the same transport. There may be potential performance advantages too. Multiple JSON-RPC commands may be sent as a batch, compared to HTTP which requires a new HTTP request for every command the client wants to send.

The interface for the new protocol would be a set of client-to-server commands, and a set of server-to-client events. Clients can send commands and subscribe to events. An OpenRPC JSON specification is included alongside this document. It describes a JSON-RPC interpretation of the current WebDriver feature set and adds some useful events.

#### Commands

 Below are some sample messages that illustrate what commands in the JSON-RPC-based WebDriver protocol might look like:

*Sample command*

```json
{
    "id": 0,
    "to": "browsingContext/111",
    "method": "getTitle",
    "params": {}
}
```

Commands include a "method" name and optional "params" object containing named parameters. A "to" field indicates which actor in the BiDi model to route the request to.

*Sample success response*

```json
{
    "id": 0,
    "result": { "title": "Example Domain" }
}
```

Responses from the server include the "id" of the command they are responding to.

*Sample error response*

```json
{
    "id": 0,
    "error": { "code": "no such frame", "message": "...", "stacktrace": "", "data": {} }
}
```

#### Events

Since events may generate a large amount of traffic over the WebSocket, and may have a runtime cost in the browser, these should be opt-in. Commands should be provided so that a client can subscribe and unsubscribe. Some events that are crucial to target discovery will be enabled by default. These are discussed in the Target Discovery section below.

The first step to receive events on the client side would be to send a "subscribe" command:

*Subscribing to events*

```json
{
    "id": 0,
    "to": "window/222",
    "method": "subscribe",
    "params": { "domains": ["logging", "network"] }
}
```

The "subscribe" command is sent to a top-level Target, in this case a Window. Sending this command tells the server to start sending logging- and network- related events to the client. The scope of a "subscribe" command is a top-level Target. This will enable events on all browsing contexts and realms that belong to that target. Enabling events for individual browsing contexts or realms is not supported. To enable events for a different top-level Target, the client must send another "subscribe" command.

The client sends a matching "unsubscribe" command when they no longer want to receive events from a Target.

*Sample event*

All event messages have a "from" property indicating which actor in the BiDi model sent the event. Event messages don't have an "id" property since they are not associated with a command request message.

```json
{
    "from": "browsingContext/333",
    "method": "logging.entryAdded",
    "params": { "type": "info", message: "Hello World!" }
}
```

To use the new bidirectional protocol, the client must first establish a WebSocket connection to the WebDriver server. This is discussed below.

## Establishing a Bidirectional Session

>[RESOLUTION](https://www.w3.org/2019/09/20-webdriver-minutes.html#resolution01): Bi-di is always enabled. An optional capability, defaulting to true, indicating that bi-di is desired. When a new session is established, the return value of the new session contains the new top-level property of the bi-directional URL

A bidirectional session starts as a traditional session created with a POST /session command. The client can request a bidirectional session using the "webSocketUrl" capability:

```json
{
    "capabilities": {
        "alwaysMatch": {
            ...
            "webSocketUrl": true
        }
    }
}
```

When "webSocketUrl" is true, bidi is enabled and the new session response includes the WebSocket URL to connect to:

```json
{
    "value": {
        "capabilities": {
            ...
            "webSocketUrl": "ws://localhost:9999/session/<session id>"
    },
    "sessionId": "<session id>"
  }
```

Once the session is created, the client would then attempt to connect to the WebSocket endpoint. After connecting, they can start sending commands and receiving events using the new protocol. Since the WebSocket is tied to a particular session, all commands would implicitly target this session and any events received would come from this session only. In other words, the client would need to open additional WebSockets to talk to other sessions.

See [Establishing a Connection](https://w3c.github.io/webdriver-bidi/#establishing) for details.

## Object Model & Message Routing

Since each WebSocket is tied to a single session, there's no need to identify which session to target when sending commands. However, there still needs to be a way to identify which browsing context, frame, element, etc... a command is targeting.

>[RESOLUTION](https://www.w3.org/2019/09/20-webdriver-minutes.html#resolution02): It should be possible for command request messages to target a particular target/browsing context.

WebDriver has a notion of a current top-level browsing context, and current browsing context. Commands that need to run in a particular browsing context implicitly target the current one. To run a command in a different window or frame, the client must first discover these other contexts using a command like "Get Window Handles" or "Find Element" and then switch into them using a "Switch To Window" or "Switch To Frame" command.

In a bidirectional world, where the remote end can generate events at potentially any time, it is possible for events to come from any context. With that in mind, it makes sense to be able to target any context and handle events from that context without the need to switch to it first. Hence, the above resolution.

### WebDriver/HTTP Model

Today, WebDriver models the browser as a hierarchy that looks something like this:

```
- WebDriver Session
    - Window
        - Frame
            - Element
```

A session has one or more windows (top-level browsing contexts). Each window has a tree of frames (nested browsing contexts), each with a tree of HTML elements. To send a command to one of these contexts, we'll need a way to identify that context. Additionally, to allow the new bidi protocol to interoperate with the existing protocol, we should try to reuse the existing identifiers where possible.

### Updated WebDriver/BiDi Model

The object model below represents a somewhat simplified view of the modern user agent as defined in https://html.spec.whatwg.org/. The model includes the all of the actors represented in WebDriver/HTTP and adds new Worker and Worklet actors. It also separates the notion of a JS Realm from a browsing context and introduces a type for representing complex JS Values:

```ts
UserAgent
    // One per session, maintains a list of active targets
    targets: Target[]

Target
    // A top-level browsing context or worker
    id: string
    type: "Window" | "SharedWorker" | "ServiceWorker"

Window : Target
    // Window-specific properties
    url: URL
    title: string
    opener: Window?
    // Reference to browsing context
    topLevelBrowsingContext: BrowsingContext

SharedWorker : Target
    // Shared worker-specific properties
    name: string
    // References to nested workers and JS realm
    workers: DedicatedWorker[]
    realm: Realm

ServiceWorker : Target
    // Service worker-specific properties
    scopeURL: string
    // References to nested workers and JS realm
    workers: DedicatedWorker[]
    realm: Realm

DedicatedWorker
    // A dedicated worker always has at most one owner, so it is not an
    // independent Target like the other types of workers.
    id: string
    owner: Window | Worker
    // References to nested workers and JS realm
    workers: DedicatedWorker[]
    realm: Realm

Worker = DedicatedWorker | SharedWorker | ServiceWorker

Worklet
    // There are a handful of Worklet types. A Worklet is associated
    // with a browsing context and has its own JS realm.
    id: string
    owner: BrowsingContext
    realm: Realm

BrowsingContext
    // Info about this browsing context
    id: string
    url: URL
    // References to parent and child browsing contexts
    parent: BrowsingContext?
    children: BrowsingContext[]
    // References to nested workers and JS realm
    workers: DedicatedWorker[]
    realm: Realm
    // References to worklets
    worklets: Worklet[]

Realm
    id: string
    owner: BrowsingContext | Worker | Worklet

Value
    // Obtained from a Realm. Represents a JS value from that Realm.
    // May represent an HTML Element.
    realm: Realm
    type: string
    id: string?
    value: object?
```

### Identifiers

Every object in the model has an `id` property that is unique throughout the Session and indicates what type of object it is. An `id` is a human-readable type name, following by a string UUID. Examples:

 - `"userAgent"` - The root user agent
 - `"window/83d07169-4143-4ae8-947c-713f6949329f"` - A window target
 - `"serviceWorker/88f77c44-250f-4c66-b788-74edaa7ba305"` - A service worker target
 - `"browsingContext/83c286bc-dc72-4678-a79f-c033b76498d7"` - A (possibly nested) browsing context

### Interop with WebDriver/HTTP

It should be possible to convert back-and-forth between WebDriver/HTTP representation and WebDriver/BiDi representations as needed. BiDi object IDs as proposed above are globally-unique within a session, but WebDriver/HTTP handles for frames and elements are valid only within a particular browsing context.  

#### Windows Handles

Today, WebDriver uses strings called "window handles" to uniquely identify top-level browsing contexts.

To obtain an HTTP-compatible window handle given a BiDi Window, the client can either query the BiDi Window for it's `httpWindowHandle` property, or get the `httWindowHandle` from the `targetCreated` event params when the Window is first created.

To obtain a BiDi Window ID given an HTTP window handle, the client can either maintain a mapping of previously-seen BiDi Window IDs to window handles. The `UserAgent` can also provide a `findWindowByHttpHandle` command to perform the conversion.

#### Frames & Elements

WebDriver/HTTP uses Web Element References to represent HTML Elements and to represent Frames in the Switch To Frame command. However, Web Element References are valid only within a particular browsing context. To obtain a BiDi Element or Frame ID given a Web Element Reference, the client would first need to know which browsing context the Web Element Reference belongs to. The `BrowsingContext` can provide `findElementByHttpHandle` and `findBrowsingContextByHttpHandle` commands to convert Web Element Referenced into a BiDi Elements or Frames respectively.

In cases where the client does not yet have the BiDi ID of the `BrowsingContext` to query, the `UserAgent` can provide `getCurrentBrowsingContext` and `getCurrentTopLevelBrowsingContext` commands. These will return BiDi IDs for the HTTP Session's "current browsing context" and "current top-level browsing context". Note that WebDriver/BiDi in this proposal does not have a notion of current or default browsing contexts. Any context is addressable at any time, and may also send events at any time.

### Message routing examples

Below are some sample bidi commands that illustrate how message routing would work in this new model:

*Send command to browsing context*

```json
{
    "id": 0,
    "to": "browsingContext/83c286bc-dc72-4678-a79f-c033b76498d7",
    "method": "navigateTo",
    "params": { "url": "http://example.com" }
}
```

*Send command to JS realm*

```json
{
    "id": 0,
    "to": "realm/83c286bc-dc72-4678-a79f-c033b76498d7",
    "method": "executeSync",
    "params": {
        "script": "return document.title;",
        "args": []
    }
}
```

#### Close a top-level window target

```json
{
    "id": 0,
    "to": "window/83c286bc-dc72-4678-a79f-c033b76498d7",
    "method": "closeTarget",
    "params": { }
}
```

#### Interop with classical WebDriver

```json
// HTTP command in existing code - HTTP POST /session/<session id>/element
{
    "using": "css selector",
    "value": "#button"
}

// Response
{
    "value": {
        "element-6066-11e4-a52e-4f735466cecf": "<element id>"
    }
}

// Get BiDi representation of current browsing context
{
    "id": 0,
    "to": "userAgent",
    "method": "getCurrentBrowsingContext",
    "params": { }
}

// Response
{
    "id": 0,
    "result": {
        "browsingContext": "browsingContext/83c286bc-dc72-4678-a79f-c033b76498d7"
    }
}

// Get BiDi representation of element from current browsing context
{
    "id": 1,
    "to": "browsingContext/83c286bc-dc72-4678-a79f-c033b76498d7",
    "method": "findElementByHttpHandle",
    "params": { "element": { "element-6066-11e4-a52e-4f735466cecf": "<element id>" } }
}

// Response
{
    "id": 1,
    "result": {
        "value": "value/88f77c44-250f-4c66-b788-74edaa7ba305"
    }
}
```

This model should make it possible to target all of the contexts that WebDriver supports today without the need for an implicit "current" context. It should also enable many of the proposed future scenarios discussed at TPAC. The next section covers how a client would discover these contexts.

## Target Discovery

Now that we've outlined a way to target commands to the right place, there needs to be a way for the client to find out about these contexts. In the traditional command/response paradigm, the user can send a command such as "Get Window Handles" to find out about currently opened tabs, or "Find Element" to grab a reference to an iframe to switch into. In this world, discovering newly opened windows means polling the "Get Window Handles" command until a new handle appears in the list. In a bidirectional world, the server can proactively notify the client when a new target is opened, or a new frame or script context is attached. We should provide a way for the client to register for these events.

### Discovering top-level targets

The simplest way to discover targets would be to send a command that replies with the current list of available targets. A new WebDriver session should have a single page target by default. Below is a proposed "getTargets" command which would be the bidi version of the existing "Get Window Handles" command.

*Command*

```json
{ "id": 0, "method": "getTargets" }
```

*Response*

```json
{ "id": 0, "result": {
    "targets": [
        { "targetId": "<ID>", "type": "page", "url": "about:blank" }
        ...
    ]
} }
```

The API could provide "targetCreated" and "targetClosed" events to let the client know when the target list changes. The client could subscribe to these events and then send an initial getTargets command. After receiving the initial list of targets, the client would start receiving updates any time the list changes. This makes it possible to do things like wait for new windows without the need for polling.

*Events*

```json
{
    "method": "targetCreated", "params": {
        "targetId": "<ID>", "type": "serviceWorker", "url": "sw.js" }
    }
}
```

```json
{
    "method": "targetClosed", "params": {
        "targetId": "<ID>"
    }
}
```

### Discovering browsing contexts

We need a similar means to discover what browsing contexts exist for a target, but these are a little different since browsing contexts exist as a tree instead of a flat list. Nested browsing contexts should provide a reference to their parent so the client knows what the tree looks like.

*Get Browsing Contexts Command*

Returns the tree of browser contexts for a given target:
```json
{
    "id": 0, "method": "getBrowsingContexts", "params": {
        "targetId": "<ID>"
    }
}
```

*Response*
```json
{
    "id": 0, "result": {
        "browsingContexts": [
            { "browsingContextId": "<ID #0>" },
            { "browsingContextId": "<ID #1>", "parentBrowsingContextId": "<ID #0>" },
            { "browsingContextId": "<ID #2>", "parentBrowsingContextId": "<ID #1>" },
            { "browsingContextId": "<ID #3>", "parentBrowsingContextId": "<ID #0>" }
        ]
    }
}
```

*Events*

Updates are sent to the client whenever a browsing context is added or removed from the tree. Attach events include the parent browsing context's ID so the client has a complete picture of the tree. In this example, browsing context #4, is being added as a child of browsing context #1. Then later, browsing context #3 is being removed from the tree.

```json
{
    "method": "browsingContextAttached", "result": {
        "parentBrowsingContextId": "<ID #1>",
        "browsingContextId": "<#ID #4>"
    }
}
```

```json
{
    "method": "browsingContextDetached", "result": {
        "browsingContextId": "<#ID #3>"
    }
}
```

Once the client has a browsing context's ID, it can send additional commands to get further info about that browsing context such as its title or current URL. These commands can also offer a similar ability to register for updates (e.g. if the client wants to know when a frame's title changes or a navigation occurs).

### Discovering script contexts

Unlike browsing contexts which have parent-child relationships to each other, and form a tree; there is no inherent relationship between two given script contexts, so these are represented as a flat list. Script contexts that happen to be associated with a browsing context (document scripts) should have a reference back to their browsing context though.

*Get Script Contexts Command*

```json
{
    "id": 0, "method": "getScriptContexts", "params": {
        "targetId": "<ID>"
    }
}
```

```json
{
    "id": 0, "result": {
        "scriptContexts": [
            { "scriptContextId": "<ID #1>", "type": "page", "browsingContextId": "<ID>" },
            { "scriptContextId": "<ID #2>", "type": "page", "browsingContextId": "<ID>" },
            { "scriptContextId": "<ID #1>", "type": "worker", "browsingContextId": "<ID>" }
        ]
    }
}
```

As with browsing contexts, there should be similar "scriptContextCreated" and "scriptContextClosed" events to let the client know if the list of script contexts changes.

## Examples

Below is some sample code using a hypothetical library built on bidi WebDriver that provides async/await wrappers for the raw JSON-RPC messages.

### Example: User Prompts

User prompts are an interesting example since they are a pre-existing WebDriver features that could benefit from bidirectional messaging.

```javascript
// Enable the alertOpened event and add a listener.
driver.on("alertOpened", params => {
    // Get alert message from event params and handle the alert.
    assert(params.message === "Please enter your name");
    await driver.sendAlertText("Joe");
    await driver.acceptAlert();
});
```

With traditional WebDriver, the client finds out about user prompts through polling. There is a limited ability to handle prompts proactively by using the unhandled prompt behavior capability. With an "alertOpened" event in the new protocol, the client can find out about a prompt right away, and handle it. This is more powerful than the unhandled prompt behavior capability, because the client can run arbitrary logic to decide how the prompt should be handled, including sending alert text.

### Example: New Windows

Using the targetCreated event, the client can find out about a new window without the need for polling. This example shows our hypothetical library using a Promise to await a one-time event.

```javascript
const element = await driver.findElement({
    browsingContext: "<ID>", using: "css selector", value: "#openWindow"
});

// Starts listening for the targetCreated event and returns a Promise that resolves once the event is fired.
const promise = driver.onceTargetCreated();

// Click the button to open a new window.
await element.click();

// Await the promise which will return the newly created window target.
const target = await promise;

// Send a command to the new target.
const browsingContexts = await driver.getBrowsingContexts({ target: target.id });
```

## Open Issues

### Using element references in script

The execute script command in the current proposal takes a script context ID and not a browsing context ID. But, if the client wants to pass in an element reference, they would need to pass in a browsing context ID as well so the server knows which context the element belongs to. As a fix, the execute script command could just get the browsing context that matches the script context and try to find the element there.

Or, disallow web element references in script commands. Instead, add a new WebDriver concept of "remote JS objects", and use these to represent elements when calling execute script. We would need additional commands to convert between web element references and remote JS object references. Similar to how DOM nodes in the Chrome devtools protocol have both DOM node IDs and remote object IDs.
