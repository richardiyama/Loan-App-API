#!/usr/bin/env bash

cp package.json ./dist/package.json
cp yarn.lock ./dist/yarn.lock
cp -r public/ ./dist/public
cp -r .secreta/ ./dist/.secreta
