var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('/var/www/html/janardan_auth/test.html');
});

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    socket.on('disconnect', function(){
        console.log( socket.name + ' has disconnected from the chat.' + socket.id);
    });
    socket.on('join', function (name) {
        socket.name = name;
        console.log(socket.name + ' joined the chat.');
    });
});

http.listen(4000, function(){
    console.log('listening on *:4000');
});
