# sse-prototype
Prototyping Server Sent Events in Node

## Requirements:
* Unix/Linux
* Node
* Python
* psutil

## Getting started:
```
git clone git@github.com:lkoudstaal/sse-prototype.git sse-prototype
cd sse-prototype
npm install
pip install psutil
./datasource.py &
node app.js <path printed by the python script>
```
Browse (using a WebKit-based browser) to localhost:3000 and see your host's average CPU load (doesn't work on Windows).
