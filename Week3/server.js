var https = require('https');
var fs = require('fs'); // Using the filesystem module
var credentials = { 
    key: fs.readFileSync('/etc/letsencrypt/live/ac10580.itp.io/privkey.pem'), 
    cert: fs.readFileSync('/etc/letsencrypt/live/ac10580.itp.io/cert.pem') 
    };


const express = require('express');
const app = express();
app.use(express.static('public'));

const server = require('https').createServer(credentials,app);
const { Server } = require('socket.io');
const io = new Server(server);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log(socket.id+'a user connected');
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
        console.log(msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('drawing', (data) => socket.broadcast.emit('draw', data));
    socket.on('Bcolor', (color) => socket.broadcast.emit("Bcolorchange", color));
    socket.on('erasing', () => socket.broadcast.emit('erase'));
    socket.on('video', (data) => io.emit('v', data));
});

// var httpsServer = https.createServer(credentials, app);
server.listen(443, () => "server started");
//server.listen(3000, () => "server started");