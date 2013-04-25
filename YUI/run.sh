#!/usr/bin/env bash

cd $(dirname $0)
	
# Get the jar to use.
jar="$(ls ./*.jar | sort | tail -n1)"
echo "jar: $jar"

(cat ./src/js/1/IHAMPPlugin.js ./src/js/1/IHAMPEngine.js  > ./src/js/merged.js)

exit 0
