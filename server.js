const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const usersPerRoom = {};
const messagesPerRoom = {};
const registeredUsers = {}; // Her oda için ayrı

function loadMessages(room) {
  const messagesFile = path.join(__dirname, `messages_${room}.json`);
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf-8');
      messagesPerRoom[room] = JSON.parse(data);
    } else {
      messagesPerRoom[room] = [];
    }
  } catch (err) {
    console.error(`Mesajlar okunamadı (${room}):`, err);
    messagesPerRoom[room] = [];
  }
}

function saveMessages(room) {
  const messagesFile = path.join(__dirname, `messages_${room}.json`);
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messagesPerRoom[room], null, 2));
  } catch (err) {
    console.error(`Mesajlar kaydedilemedi (${room}):`, err);
  }
}

function broadcastUserList(room) {
  io.to(room).emit('user list', Object.values(usersPerRoom[room] || {}));
}

io.on('connection', (socket) => {
  let userName = '';
  let currentRoom = '';

  socket.on('join', ({ name, room }) => {
    userName = name;
    currentRoom = room;

    socket.join(room);

    if (!usersPerRoom[room]) usersPerRoom[room] = {};
    if (!messagesPerRoom[room]) loadMessages(room);

    usersPerRoom[room][socket.id] = userName;

    // Oda bazlı kayıtlı kullanıcılar
    if (!registeredUsers[room]) registeredUsers[room] = new Set();
    registeredUsers[room].add(userName);

    socket.emit('message history', messagesPerRoom[room]);
    socket.to(room).emit('user joined', userName);

    broadcastUserList(room);

    // Sadece o odanın kayıtlı kullanıcı listesi
    io.to(room).emit('all user list', Array.from(registeredUsers[room]));
  });

  socket.on('chat message', (msg) => {
    if (!currentRoom) return;
    messagesPerRoom[currentRoom].push(msg);

    if (messagesPerRoom[currentRoom].length > 100) messagesPerRoom[currentRoom].shift();

    saveMessages(currentRoom);

    io.to(currentRoom).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    if (userName && currentRoom && usersPerRoom[currentRoom]) {
      socket.to(currentRoom).emit('user left', userName);
      delete usersPerRoom[currentRoom][socket.id];
      broadcastUserList(currentRoom);
      // Kullanıcıyı registeredUsers'dan silmek istersen:
      // if (registeredUsers[currentRoom]) {
      //   registeredUsers[currentRoom].delete(userName);
      //   io.to(currentRoom).emit('all user list', Array.from(registeredUsers[currentRoom]));
      // }
    }
  });
});

// SPA fallback (en sonda!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});