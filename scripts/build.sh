#!/bin/bash
set -ex

if ! [ -x "$(command -v bikeshed)" ] || [ "$1" = "--upgrade" ]; then
    echo 'Installing bikeshed'
    python3 -m pip install bikeshed
fi

bikeshed update
bikeshed --die-on=warning spec index.bs
