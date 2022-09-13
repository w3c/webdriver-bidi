# WebDriver BiDi

WebDriver BiDi is a proposed bidirectional protocol for browser automation,
building on and extending [WebDriver](https://w3c.github.io/webdriver/).

WebDriver BiDi is not ready. Here's what we have so far:

- An [explainer](./explainer.md) with more background and goals
- Detailed [proposals](./proposals/) for the initial protocol
- A [unofficial spec draft](https://w3c.github.io/webdriver-bidi/) waiting to be fleshed out

## How to build the specification locally

We use [bikeshed](https://tabatkins.github.io/bikeshed/) to generate the specification.

Make sure you have the [right version of python](https://tabatkins.github.io/bikeshed/#install-py3) installed.

Now you can run in your terminal:

```bash
./scripts/build.sh
```

This script will install `bikeshed` (if not installed yet) and generate an
`index.html` file for the specification.

Later on, you can use the `--upgrade` argument to force installing a newer version.

## How to generate CDDL locally

Make sure you have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
and [rust](https://www.rust-lang.org/tools/install) installed.

Now you can run in your terminal:

```bash
./scripts/test.sh
```

This script will install required npm and cargo packages (if not installed yet)
and generate the CDDL files for the remote end (`remote.cddl`) and the client
(`local.cddl`).

Later on, you can use the `--upgrade` argument to force installing newer versions.
