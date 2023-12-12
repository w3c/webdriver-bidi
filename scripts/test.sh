#!/bin/bash
set -ex

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
ROOT="$(dirname "$SCRIPT_DIR")"

if ! [ -x "$(command -v cddl)" ] || [ "$1" = "--upgrade" ]; then
  echo 'Installing cddl'
  # Remove strict version requirement here and for the Rust cache
  # once the CLI command works again.
  # See: https://github.com/anweiss/cddl/issues/213
  cargo install cddl --version 0.9.1
fi

if [[ "$(npm list parse5)" =~ "empty" ]] || [ "$1" = "--upgrade" ]; then
  echo 'Installing npm package parse5'
  npm install parse5
fi

# Extract CDDL content from spec into files
"$ROOT"/scripts/cddl/generate.js

cddl compile-cddl --cddl local.cddl
cddl compile-cddl --cddl remote.cddl
cddl compile-cddl --cddl all.cddl
