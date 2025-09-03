# WebDriver BiDi

WebDriver BiDi is a bidirectional protocol for browser automation,
building on and extending [WebDriver](https://w3c.github.io/webdriver/).

WebDriver BiDi is a living standard that continuously gets new features added. For more info, consult these resources:

- An [explainer](./explainer.md) with more background and goals
- A [roadmap](./roadmap.md) based on real-world end-to-end user scenarios
- Detailed [proposals](./proposals/) for the initial protocol
- A [spec](https://w3c.github.io/webdriver-bidi/) under active development
- [Browser-compat-data](https://github.com/mdn/browser-compat-data/tree/main/webdriver/bidi) with the current implementation status of the protocol

## Status

[![test](https://github.com/w3c/webdriver-bidi/actions/workflows/test.yml/badge.svg)](https://github.com/w3c/webdriver-bidi/actions/workflows/test.yml)

## How to build the specification locally

We use [bikeshed](https://tabatkins.github.io/bikeshed/) to generate the specification.

Make sure you have the [right version of python](https://tabatkins.github.io/bikeshed/#install-py3) installed.

Now you can run in your terminal:

```bash
./scripts/build.sh
```

This script installs `bikeshed` (if not installed yet) and generates an
`index.html` file for the specification.

Later on, you can use the `--upgrade` argument to force installing a newer version.

## How to generate CDDL locally

Make sure you have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
and [rust](https://www.rust-lang.org/tools/install) installed.

Now you can run in your terminal:

```bash
./scripts/test.sh
```

This script installs required `npm` and `cargo` packages (if not installed yet)
and generates the CDDL files for the remote end (`remote.cddl`) and the client
(`local.cddl`).

Later on, you can use the `--upgrade` argument to force installing newer versions.
