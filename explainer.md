# Bidirectional WebDriver Protocol Explainer

WebDriver BiDi (Bi-Directional) is being developed to allow web developers to migrate from
Chromium-only [CDP](https://chromedevtools.github.io/devtools-protocol/)-based (Chrome DevTools
Protocol) developer tooling to cross-browser tooling.

## Motivation

Many developer tools are exclusively targetting Chrome, relying on CDP, resulting in websites being
better tested against Chrome and leading to site compatibility bugs for other browsers.

WebDriver BiDi introduces a new protocol, designed to be used in conjunction with the existing
WebDriver protocol, allowing new functionality to be introduced to reduce the gap in functionality
to CDP and allowing developer tooling to target a wider variety of browsers.

WebDriver BiDi should help ensure a better end-user experience across all browsers by allowing
developers to use the same tooling across all browsers.

## Goals

- **Support for the top customer scenarios
  [identified](https://www.w3.org/2019/09/19-webdriver-minutes.html#item03) at
  [TPAC 2019](https://www.w3.org/2019/09/TPAC/):**
    - Listen for DOM events
    - Log what's going on in the browser including console and JS errors
    - Fail fast on any JS error
    - Mock backends and intercept network requests
    - Record traffic
    - Full-page screenshot
    - Access to native devtools protocol
    - Dynamic changes to iframe or documents
    - Performance timings
    - Notifying of new contexts
    - Bootstrap scripts
- **Interoperability with classical WebDriver commands**
    - Allow existing test/automation code to be upgraded gradually.
- **Feature parity with existing WebDriver commands**
    - Existing commands can be sent over the new protocol so that new test/automation code can be written entirely in the new protocol.
    - Update features to take advantage of bidi communication where appropriate. Useful for unhandled prompts and scenarios where polling is common.
- **A machine and human-readable API specification**
    - Makes it easier to generate up-to-date language bindings, documentation, and test cases.
- **Easily mappable to/from native devtools protocols**
    - Simple for browser vendors to implement and maintain.
    - Possible for clients to enhance their WebDriver automation with browser-specific devtools protocol features.

## Non-goals

Feature parity with CDP is a non-goal at this time; many features of CDP are rarely used by
existing developer tooling, and being able to entirely supplant CDP is not a goal at this time.

## Prior Art

\[FIXME: [CDP](https://chromedevtools.github.io/devtools-protocol/),
         [Firefox Remote Debug Protocol](https://firefox-source-docs.mozilla.org/devtools/backend/protocol.html),
         [Firefox Remote Protoco](https://wiki.mozilla.org/WebDriver/RemoteProtocol)l,
         WebKit Inspector Protocol\]

## Design

WebDriver BiDi defines a transport layer (built on top of WebSockets) and a protocol on top of that
(using JSON, where the messages are described in the standard using
[CDDL](https://tools.ietf.org/html/rfc8610)).

### Choice of Transport Layer

\[FIXME\]

### Choice of Protocol Layer

\[FIXME. Why JSON?\]

CDDL is used to describe the protocol layer because it provides formal semantics, accomplishing the
"machine-readable API specification" goal while being similar to JSON-RPC used in the prior art.

### Considered alternatives

\[FIXME: Adopting CDP wholesale\]

## Privacy and Security Concerns

Any protocol that can be used for web testing automation can also open browsers up to malicious
actors. It is vital that any functionality cannot be accessed from web platform content; browsers
with multi-process architectures may want to minimise the amount of functionality within the web
content process to avoid the use of that functionality with any remote-code execution exploit
within the process.

Other threats include:

- Malware connecting to a user's browser and intercepting private data (through observing network
  requests) or maliciously controlling it (e.g. sending a payment when logged in to a bank).

- \[FIXME: ...\]
