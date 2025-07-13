const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statik dosyaları servis et (public klasörü)
app.use(express.static(path.join(__dirname, 'public')));

// Oda ve mesaj yönetimi için değişkenler
const usersPerRoom = {};
const messagesPerRoom = {};
const registeredUsers = new Set();

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
    registeredUsers.add(userName);

    socket.emit('message history', messagesPerRoom[room]);
    socket.to(room).emit('user joined', userName);

    broadcastUserList(room);

    // Kayıtlı (tüm zamanların) kullanıcı listesini herkese gönder
    io.emit('all user list', Array.from(registeredUsers));
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
      // (Kayıtlı kullanıcıdan silmek istersen buraya ekleyebilirsin, şu an tüm zamanların listesi tutuluyor)
      // registeredUsers.delete(userName);
      // io.emit('all user list', Array.from(registeredUsers));
    }
  });
});

// Sadece kendi odalarını SPA olarak handle et! (public ve socket.io dışı her şey)
app.get('/:room', (req, res, next) => {
  // Eğer istek /socket.io/ ile başlıyorsa bu route'u geç.
  if (req.path.startsWith('/socket.io/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});