const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};

function broadcastUserList() {
  io.emit('user list', Object.values(users));
}

io.on('connection', (socket) => {
  let userName = '';

  socket.on('join', (name) => {
    userName = name;
    users[socket.id] = userName;
    socket.broadcast.emit('user joined', userName);
    broadcastUserList();
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    if (userName) {
      socket.broadcast.emit('user left', userName);
      delete users[socket.id];
      broadcastUserList();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});