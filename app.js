var express = require('express');
var os = require('os');
var events = require('events');
var util = require('util');
var redis = require('redis');

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
    
    var subscriber = redis.createClient(6379,'localhost');
    subscriber.subscribe('cpupercent');
    
    subscriber.on("error", function(err) {
        console.log("Redis Error: " + err);
    });

    subscriber.on("message", function(channel, message) {
        messageCount++;
        res.write('id: ' + messageCount + '\n');
        res.write("data: " + message + '\n\n'); // Note the extra newline
    });

    // When the browser is closed, a 'close' event is triggered
    // when that happens, we remove the listener
    req.on("close", function() {
        console.log('Browser closed.');
        subscriber.unsubscribe();
        subscriber.quit();
    });
});

app.listen(3000);
