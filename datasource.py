#!/usr/bin/env python
import psutil
import time
import tempfile

with tempfile.NamedTemporaryFile('wt') as t:
    print(t.name)
    while True:
        t.seek(0)
        t.truncate()
        t.write('{}\n'.format(psutil.cpu_percent()))
        t.flush()
        time.sleep(1)
