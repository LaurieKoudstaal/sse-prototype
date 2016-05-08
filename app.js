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



// Serve the update stream
app.get('/update-stream', function(req, res) {
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    
    var messageCount = 0;

    // create a callback to send the sse:
    callback = function(loadavg) {
        messageCount++; // Increment our message count
        res.write('id: ' + messageCount + '\n');
        res.write("data: " + loadavg + '\n\n'); // Note the extra newline
    }
    emitter.on('update', callback);
    
    

    
    req.on("close", function() {
        console.log('Browser closed.');
        emitter.removeListener('update', callback);
    });
});

setInterval(function() {
    emitter.emit('update',os.loadavg()[0]);
}, 5000);

app.listen(3000);
