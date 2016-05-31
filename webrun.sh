#!/bin/bash
source /data/env
pm2 delete griefstore-mail
export VIRTUAL_HOST="$PC_MAIL_SERVICE"
pm2 start ./index.js --node-args="--harmony" --name griefstore-mail