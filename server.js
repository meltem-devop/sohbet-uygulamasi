const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};
const messages = []; // Mesajları burada saklıyoruz

function broadcastUserList() {
  io.emit('user list', Object.values(users));
}

io.on('connection', (socket) => {
  let userName = '';

  // Yeni bağlanan kullanıcıya eski mesajlar gönder
  socket.emit('message history', messages);

  socket.on('join', (name) => {
    userName = name;
    users[socket.id] = userName;
    socket.broadcast.emit('user joined', userName);
    broadcastUserList();
  });

  socket.on('chat message', (msg) => {
    messages.push(msg); // Mesajı kaydet
    io.emit('chat message', msg);
    // (Opsiyonel) Eğer çok mesaj olursa, ilk 100 mesajı tutmak için:
    // if (messages.length > 100) messages.shift();
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