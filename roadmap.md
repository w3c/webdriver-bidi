# WebDriver BiDi roadmap

## Real-world end-to-end user scenarios

This document presents an overview of real-world end-to-end user scenarios we aim to enable via the WebDriver BiDi protocol. Each scenario requires one or more WebDriver BiDi commands and events to be specified, tested, and implemented across browser engines.

The order of implementing specific features is not strictly enforced, but browser vendors are advised to align with it to offer a rich and cross-browser experience to consumers right from the beginning.

### Logging of console messages and JavaScript errors

_This is a highly requested feature and not possible with WebDriver classic._

This scenario loads a web page and uses BiDi event subscription to efficiently get notified about Console API entries (eg. `console.log()`) and raised JavaScript errors. In spec terms, this involves:

- [x] [Handling sessions](https://w3c.github.io/webdriver-bidi/#module-session)
- [x] [Navigating to a URL](https://w3c.github.io/webdriver-bidi/#command-browsingContext-navigate)
- [x] [Subscribing to events](https://w3c.github.io/webdriver-bidi/#command-session-subscribe)
- [x] [Emitting a log event](https://w3c.github.io/webdriver-bidi/#event-log-entryAdded)
- [x] [Serialization and deserialization of JavaScript values](https://w3c.github.io/webdriver-bidi/#data-types-protocolValue)
- [x] [Unsubscribing from events](https://w3c.github.io/webdriver-bidi/#command-session-unsubscribe)

### Extracting content

This scenario loads a web page within a new tab, and uses script evaluation to extract content on the page (e.g. the headlines). In spec terms, this involves:

- [x] Some items from the previous scenario
- [x] [Creating a new `browsingContext`](https://w3c.github.io/webdriver-bidi/#command-browsingContext-create)
- [x] [Evaluating JavaScript in the page context](https://w3c.github.io/webdriver-bidi/#command-script-evaluate)
- [x] [Closing the `browsingContext`](https://w3c.github.io/webdriver-bidi/#command-browsingContext-close)

### Network events for measuring page load performance

This scenario sets up handlers for network events and then navigates to a web page. The provided timing information from the emitted events can be used to measure the page load performance by storing the relevant data eg. in a HAR file. In spec terms, this involves:

- [x] Some items from the previous scenario
- [ ] [Network events for the request to be sent, and response started and completed](https://github.com/w3c/webdriver-bidi/pull/204)

### Submitting forms

This scenario loads a web page, enters text into a form field via the keyboard, and submits the form via a mouse click before extracting the results from the page. In spec terms, this involves:

- [x] Everything from the previous scenario
- [x] [Emulating keyboard input](https://github.com/w3c/webdriver-bidi/pull/175)
- [x] [Emulating mouse input](https://github.com/w3c/webdriver-bidi/pull/175)

### Capturing screenshots

This scenario loads a web page and captures a screenshot. In spec terms, this involves:

- [x] Some items from the previous milestones
- [x] [Capturing a screenshot as Base64-encoded string](https://w3c.github.io/webdriver-bidi/#command-browsingContext-captureScreenshot)

### Observing changes being made to the DOM tree

In this scenario a `MutationObserver` is installed by a bootstrap script as early as the document gets created. It watches for changes made to the DOM tree and sends the relevant updates to the client. In spec terms, this involves:

- [x] Some items from the previous scenarios
- [ ] [Adding a preload script](https://w3c.github.io/webdriver-bidi/#command-script-addPreloadScript)
- [ ] [Installing the preload script](https://w3c.github.io/webdriver-bidi/#preload-scripts)
- [ ] [Back channel for communicating with the client](https://github.com/w3c/webdriver-bidi/pull/361)
- [ ] [Removing a preload script](https://w3c.github.io/webdriver-bidi/#command-script-removePreloadScript)

### Replacing resources with test data

This scenario loads a web page and uses network request interception to replace any image in that page with a custom image. In spec terms, this involves:

- [x] Some items from the previous scenarios
- [ ] [Intercepting network requests](https://github.com/w3c/webdriver-bidi/issues/66)

### HTTP authentication

This scenario loads a web page that is protected behind user credentials. In spec terms, this involves:

- [x] Some items from the previous scenarios
- [ ] [The event for a HTTP auth challenge](https://github.com/w3c/webdriver-bidi/issues/66)
- [ ] [The command to provide the authentication response](https://github.com/w3c/webdriver-bidi/issues/66)

### Handling onbeforeunload prompts

This scenario loads a web page with a registered `beforeunload` event handler. After updating the value of some form input elements it should be checked that navigating away opens the beforeonload prompt. In spec terms, this involves:

- [x] Some items from the previous scenarios
- [ ] [The event when a user prompt opens](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-user-prompt-opened)
- [ ] [Handling the beforeunload prompt](https://w3c.github.io/webdriver-bidi/#command-browsingContext-handleUserPrompt)
- [ ] [The event when a user prompt closes](https://w3c.github.io/webdriver-bidi/#webdriver-bidi-user-prompt-closed)

### Printing to PDF

This scenario loads a web page and prints it as a PDF. In spec terms, this involves:

- [x] Some items from the previous milestones
- [ ] [Printing to PDF as Base64-encoded string](https://github.com/w3c/webdriver-bidi/issues/210)
