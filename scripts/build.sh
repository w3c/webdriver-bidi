#!/bin/bash
set -ex

if ! [ -x "$(command -v bikeshed)" ]; then
    echo 'Installing bikeshed'
    python3 -m pip install bikeshed
elif [ "$1" = "--upgrade" ]; then
    echo 'Upgrading bikeshed'
    python3 -m pip install --upgrade bikeshed
fi

bikeshed update
bikeshed --die-on=warning spec index.bs
