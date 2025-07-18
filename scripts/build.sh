#!/bin/bash
set -ex

if ! python3 -c "import bikeshed" 2>/dev/null; then
    echo 'Installing bikeshed'
    python3 -m pip install bikeshed
elif [ "$1" = "--upgrade" ]; then
    echo 'Upgrading bikeshed'
    python3 -m pip install --upgrade bikeshed
fi

python3 -m bikeshed update
python3 -m bikeshed --die-on=warning spec index.bs
