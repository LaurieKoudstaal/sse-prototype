# sse-prototype
Prototyping Server Sent Events in Node

## Requirements:
* Unix/Linux
* Node
* Python
* Redis
* python Redis
* node Redis
* psutil

## Getting started:
```
git clone git@github.com:lkoudstaal/sse-prototype.git sse-prototype
cd sse-prototype
npm install
./datasource.py &
node app.js &
```
Browse (using a WebKit-based browser) to localhost:3000 and see your host's average CPU load (doesn't work on Windows).
