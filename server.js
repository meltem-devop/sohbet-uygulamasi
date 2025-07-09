const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Statik dosyalar (frontend) için 'public' klasörü kullanılacak
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı');

  // Gelen mesajı herkese gönder
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı');
  });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});