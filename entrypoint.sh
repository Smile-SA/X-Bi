#!/bin/sh

set -e

# shellcheck disable=SC2039
if [ "$(echo "$1" | cut -c1-1)" = '-' ]; then
    set -- http-server dist -p 8082 "$@"
fi
exec "$@"

