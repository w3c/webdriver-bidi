#! /bin/bash
set -ex

SCRIPT_DIR=$(cd $(dirname "$0") && pwd -P)
ROOT=$(dirname $SCRIPT_DIR)

if ! [ -x "$(command -v bikeshed)" ] || [ "$1" = "--upgrade" ]; then
    echo 'Installing bikeshed'
    pip install bikeshed
fi

bikeshed --die-on=fatal spec index.bs
