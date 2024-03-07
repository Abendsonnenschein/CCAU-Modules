#!/bin/sh

tsc && esbuild --bundle out/index.js --outfile=dist/user.js --banner:js="$(cat meta.txt)"
