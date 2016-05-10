#!/bin/sh
# scp -r ./build/web-mobile/  root@cross2d.com:/var/www/html/kitch/

rsync --delete-before -a -H -v root@cross2d.com:/var/www/html/effect/
rsync -azv  --progress  ./build/web-mobile/ root@cross2d.com:/var/www/html/effect/
