# WebDriver BiDi

WebDriver BiDi is a proposed bidirectional protocol for browser automation,
building on and extending [WebDriver](https://w3c.github.io/webdriver/).

WebDriver BiDi is not ready. Here's what we have so far:
- An [explainer](./explainer.md) with more background and goals
- Detailed [proposals](./proposals/) for the initial protocol
- A [unofficial spec draft](https://w3c.github.io/webdriver-bidi/) waiting to be fleshed out


## How to build the specification locally

We use [bikeshed](https://tabatkins.github.io/bikeshed/) to generate the specification.

Make sure you have [a right version of python](https://tabatkins.github.io/bikeshed/#install-py3) installed.

Now you can run in your terminal:
```
./scripts/build.sh --install
```
This script will install `bikeshed` and generate an `index.html` file for the specification.

Later on, you can omit `--install` argument to skip the installation step.

## How to generate CDDL locally

Make sure you have `npm` and `rust` installed.

Now you can run in your terminal:
```
./scripts/test.sh --install
```
This script will install required npm and cargo packages and generate CDDL.

Later on, you can omit `--install` argument to skip the installation step.