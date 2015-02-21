// node.js api that will take a hltv match id as a get variable and
// return the current score of that match if available.

// Created by: Pierre Schönbeck

var http = require('http'),
    io = require('socket.io-client'),
    url = require('url');

// Init the server
var server = http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-type': 'application/json'
    });

    var queryObject = url.parse(request.url,true).query;
    var matchid = queryObject.matchid;

    // If input is a valid number
    if (!isNaN(matchid)) {
        // Start connection to hltv score bot
        socket = io.connect('http://scorebot.hltv.org:10022');
        // Listener for new scores
        socket.on('score', function(score) {

            jsonobj = {
                "scorea" : score['ctScore'],
                "scoreb" : score['tScore']
            };

            // echo current score
            response.end(JSON.stringify(jsonobj));
        });
        // Tell hltv score bot to start sending scores
        socket.emit('readyForMatch', matchid);
    } else {
        // echo error
        response.end(JSON.stringify({"error" : "Incorrect match id value"}));
    }
});

// Start listening server
server.listen(8000, 'ikinz.se');
