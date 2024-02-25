#!/usr/bin/env sh

python3 -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q

