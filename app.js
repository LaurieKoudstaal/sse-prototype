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

// create a callback to send the sse:
callback = function(loadavg) {
        messageCount++; // Increment our message count
        res.write('id: ' + messageCount + '\n');
        res.write("data: " + loadavg + '\n\n'); // Note the extra newline
    }

// Serve the update stream
app.get('/update-stream', function(req, res) {
    req.socket.setTimeout(Infinity);
    
    req.socket.setTimeout(Infinity);

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    emitter.on('update', callback);
    
    res.write('\n');

    
    req.on("close", function() {
        console.log('Browser closed.');
        emitter.removeListener(callback);
    });
});

setInterval(function() {
    emitter.emit('update',os.loadavg()[0]);
}, 5000);
    
