#!/bin/sh

tsc
esbuild --bundle out/index.js --outfile=dist/user.js --banner:js="$(cat meta.txt)"
esbuild --bundle out/index.js --outfile=dist/mini.js --banner:js="$(cat meta.txt)" --minify
