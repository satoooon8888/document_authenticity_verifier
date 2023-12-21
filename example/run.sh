#!/bin/bash -ex

cd src
deno run --allow-env --allow-read=./claim,index.html --allow-net ./index.js
