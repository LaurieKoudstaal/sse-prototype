var express = require('express');
var os = require('os');
var events = require('events');
var util = require('util');

var app = express();

// Create an event emitter to emit an event every
// time there is a new load avg
function Emitter() {
    events.call(this)
}
util.inherits(Emitter, events);
var emitter = new Emitter();

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

    // create a callback to send the sse and listen to our event
    callback = function(loadavg) {
        messageCount++;
        res.write('id: ' + messageCount + '\n');
        res.write("data: " + loadavg + '\n\n'); // Note the extra newline
    }
    emitter.on('update', callback);

    // When the browser is closed, a 'close' event is triggered
    // when that happens, we remove the listener
    req.on("close", function() {
        console.log('Browser closed.');
        emitter.removeListener('update', callback);
    });
});

// Every 1 second, send the os.loadavg
// In real world uses, you'd probably want to use a push-based
// approach, not polling.
setInterval(function() {
    emitter.emit('update',os.loadavg()[0]);
}, 1000);

app.listen(3000);
