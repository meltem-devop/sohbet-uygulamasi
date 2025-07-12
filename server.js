const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Dinamik oda route'u (SPA için) – bu satır çok önemli!
app.get('/:room', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Her oda için kullanıcılar ve mesajlar tutulacak
const usersPerRoom = {};
const messagesPerRoom = {};

// Bir odanın mesajlarını dosyadan oku
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

// Bir odanın mesajlarını dosyaya kaydet
function saveMessages(room) {
  const messagesFile = path.join(__dirname, `messages_${room}.json`);
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messagesPerRoom[room], null, 2));
  } catch (err) {
    console.error(`Mesajlar kaydedilemedi (${room}):`, err);
  }
}

function broadcastUserList(room) {
  // Kullanıcı adlarını array olarak gönderiyoruz (sadece string)
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

    // KESİNLİKLE SADECE İSMİ KAYDET!
    usersPerRoom[room][socket.id] = userName;

    socket.emit('message history', messagesPerRoom[room]);

    // Yine sadece ismi gönder
    socket.to(room).emit('user joined', userName);

    broadcastUserList(room);
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
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});