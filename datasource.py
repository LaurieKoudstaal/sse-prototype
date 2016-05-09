#!/usr/bin/env python

import redis
import psutil
import time

r = redis.StrictRedis(host='localhost', port=6379, db=0)


while True:
    r.publish('cpupercent', psutil.cpu_percent())
    time.sleep(1)
