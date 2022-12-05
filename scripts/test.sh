#! /bin/bash
set -ex

SCRIPT_DIR=$(cd $(dirname "$0") && pwd -P)
ROOT=$(dirname $SCRIPT_DIR)

sh $ROOT/scripts/cddl/test.sh
node $ROOT/scripts/formatter/no_split_var.js
