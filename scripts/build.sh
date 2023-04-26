#!/bin/bash
set -ex

if ! [ -x "$(command -v bikeshed)" ] || [ "$1" = "--upgrade" ]; then
    echo 'Installing bikeshed'
    pip install bikeshed
fi

bikeshed update
bikeshed --die-on=warning spec index.bs
