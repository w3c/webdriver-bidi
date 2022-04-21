#! /bin/bash
set -ex

SCRIPT_DIR=$(cd $(dirname "$0") && pwd -P)
ROOT=$(dirname $SCRIPT_DIR)

if [ "$1" = "--install" ]; then
    cargo install cddl
    npm install parse5
fi
# Extract CDDL content from spec into files
$ROOT/scripts/cddl/generate.js

cddl compile-cddl --cddl local.cddl
cddl compile-cddl --cddl remote.cddl
