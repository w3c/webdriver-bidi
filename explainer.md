# Bidirectional WebDriver Protocol

## Overview

This document presents a possible design for a bidirectional WebDriver protocol, incorporating scenarios and resolutions discussed at the TPAC 2019 working group meeting. The protocol uses JSON-RPC messaging over WebSockets as the transport mechanism. WebDriver's current model of the browser is extended to include service workers and other non-page targets and make it possible for clients to target these additional contexts. We also discuss how the new protocol can interoperate with the existing protocol. Sample protocol messages illustrating how the protocol would work are included, and an JSON API specification is included alongside the document.

## Goals

The protocol is designed with the following goals in mind:

- **Support for the top customer scenarios identified at TPAC 2019:**
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

This document doesn't attempt to dive into the any of the new feature scenarios identified above, but rather tries to provide a solid foundation and the necessary primitives to build these features on. The document does walk through an example of an existing WebDriver feature (unhandled prompts) being updated for a bidirectional world.

## Proposals

- [Core Functionality](./proposals/core.md)
- [Bootstrap Scripts](./proposals/bootstrap-scripts.md)

[openrpc.json](./proposals/openrpc.json) contains an OpenRPC specification with an initial set of proposed commands and events.

## References

1. [WebDriver](https://w3c.github.io/webdriver/)
2. [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
3. [OpenRPC Specification](https://spec.open-rpc.org/)
4. [Browser Tools- and Testing WG, Day 1, TPAC 2019, Fukuoka](https://www.w3.org/2019/09/19-webdriver-minutes.html)
5. [Browser Tools- and Testing WG, Day 2, TPAC 2019, Fukuoka](https://www.w3.org/2019/09/20-webdriver-minutes.html)
