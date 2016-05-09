var express = require('express');
var watch = require('node-watch');
var fs = require('fs');

var app = express();

// Serve up the front-end as static pages
app.use('/', express.static('ui'));

// Serve the server-sent event
app.get('/update-stream', function(req, res) {
    // We set the timeout as large as possible so the connection
    // can stay open as long as possible. Note that the timeout
    // has to be a finite positive integer, so Infinity won't work.
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER);

    // Set up the headers for an always-on event stream
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n'); // This line is necessary to avoid client side errors

    // Message count will be our ID.
    var messageCount = 0;

    watch(process.argv[2], function(){
        fs.readFile(process.argv[2], function(err, data) {
            messageCount++;
            res.write('id: ' + messageCount + '\n');
            res.write("data: " + data + '\n\n'); // Note the extra newline
        });
    });

    // When the browser is closed, a 'close' event is triggered
    // when that happens, we remove the listener
    req.on("close", function() {
        console.log('Browser closed.');        
    });
});

app.listen(3000);
