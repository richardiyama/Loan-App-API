#!/usr/bin/env bash

env=${1}
cp ./src/config/environment/${env}.env.ts ./src/config/environment/index.ts
