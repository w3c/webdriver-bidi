#! /bin/bash
set -ex

SCRIPT_DIR=$(cd $(dirname "$0") && pwd -P)
ROOT=$(dirname $SCRIPT_DIR)

if [ "$1" = "--install" ]; then
    pip install bikeshed
fi

bikeshed --die-on=warning spec index.bs
