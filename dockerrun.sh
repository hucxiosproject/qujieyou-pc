#!/bin/bash
source /data/env
eval "$(weave proxy-env)"

docker build -t grief-write-mail .
docker stop grief-write-mail
docker rm grief-write-mail
docker run -d --name grief-write-mail \
				-p 5099:5000 \
        -e VIRTUAL_HOST="$GRIEF_WRITE_LETTER" \
        grief-write-mail
