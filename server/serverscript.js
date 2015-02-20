var http = require('http'),
    io = require('socket.io-client');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-type': 'text/plain'
    });
    
    socket = io.connect('http://scorebot.hltv.org:10022');
    socket.on('score', function(score) {
        //console.log(score['ctScore'] + "\n");
        //console.log(score['tScore']);
        
        response.write(score['ctScore'] + "\n" + score['tScore']);
        response.end();
    });
    socket.emit('readyForMatch', 347785);
});

server.listen(8000, 'ikinz.se');