# WebDriver BiDi roadmap

## Real-world end-to-end user scenarios

This document presents an overview of real-world end-to-end user scenarios we aim to enable via the WebDriver BiDi protocol. Each scenario requires one or more WebDriver BiDi commands and events to be specified, tested, and implemented across browser engines.

### A. Extracting content

This scenario loads a web page and uses script evaluation to extract content on the page (e.g. the headlines). In spec terms, this involves:

- [x] [handling sessions](https://w3c.github.io/webdriver-bidi/#module-session)
- [x] [creating a new `browsingContext`](https://w3c.github.io/webdriver-bidi/#command-browsingContext-create)
- [x] [navigating to a URL](https://w3c.github.io/webdriver-bidi/#command-browsingContext-navigate)
- [x] [evaluating JavaScript in the page context](https://w3c.github.io/webdriver-bidi/#command-script-evaluate)
- [x] [serialization/deserialization of JavaScript values](https://w3c.github.io/webdriver-bidi/#data-types-protocolValue)
- [ ] [sandboxed script execution](https://github.com/w3c/webdriver-bidi/issues/144)

### B. Submitting forms

This scenario loads a web page, enter text into a form field via the keyboard, and submits the form via a mouse click before extracting the results from the page. In spec terms, this involves:

- [x] (everything from the previous milestone)
- [ ] [emulating keyboard input](https://github.com/w3c/webdriver-bidi/pull/175)
- [ ] [emulating mouse input](https://github.com/w3c/webdriver-bidi/pull/175)

### C. Capturing screenshots

This scenario loads a web page and captures a screenshot. In spec terms, this involves:

- [x] (some items from the previous milestones)
- [ ] [capturing a screenshot via a command](https://w3c.github.io/webdriver-bidi/#command-browsingContext-captureScreenshot)

### D. Printing to PDF

This scenario loads a web page and prints it as a PDF. In spec terms, this involves:

- [x] (some items from the previous milestones)
- [ ] [printing to PDF via a command](https://github.com/w3c/webdriver-bidi/issues/210)

### E. Blocking images

This scenario loads a web page and uses request interception to block any images from loading. In spec terms, this involves:

- [x] (some items from the previous milestones)
- [ ] [intercepting requests](https://github.com/w3c/webdriver-bidi/issues/66)

### F. Measuring performance

This scenario measures the performance of a cold load of a web page (without any cookies, storage, or anything in the cache).

- [x] (some items from the previous milestones)
- [ ] manipulating cookies
- [ ] managing the browser cache
- [ ] [installing bootstrap scripts](https://github.com/w3c/webdriver-bidi/blob/master/proposals/bootstrap-scripts.md#record-navigation-performance)
