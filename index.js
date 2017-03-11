var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('addme', function(username) {
        socket.username = username;
        socket.emit('chat', 'SERVER', '你已加入聊天室...');
        socket.broadcast.emit('chat', 'SERVER', username + ' 進入聊天室...');
    });
    socket.on('sendchat', function(data) {
        io.sockets.emit('chat', socket.username, data);
    });

    socket.on('disconnect', function() {
        io.sockets.emit('chat', 'SERVER', socket.username + ' 離開聊天室...');
    });
});


http.listen(port, function() {
    console.log('listening on *:' + port);
});