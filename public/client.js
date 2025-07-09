const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const userList = document.getElementById('user-list');

let nickname = '';

while (!nickname) {
  nickname = prompt('Lütfen bir kullanıcı adı girin:');
}

socket.emit('join', nickname);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    socket.emit('chat message', {
      name: nickname,
      text: input.value,
      time: `${hour}:${minute}`
    });
    input.value = '';
  }
});

// Geçmiş mesajları ekrana yaz
socket.on('message history', function(msgArray) {
  messages.innerHTML = '';
  msgArray.forEach(function(msg) {
    const item = document.createElement('li');
    if (msg.name === nickname) {
      item.classList.add('my-message');
    }
    item.textContent = `[${msg.time}] ${msg.name}: ${msg.text}`;
    messages.appendChild(item);
  });
  messages.scrollTop = messages.scrollHeight;
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  if (msg.name === nickname) {
    item.classList.add('my-message');
  }
  item.textContent = `[${msg.time}] ${msg.name}: ${msg.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user joined', function(name) {
  const item = document.createElement('li');
  item.textContent = `${name} sohbete katıldı.`;
  item.style.fontStyle = 'italic';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user left', function(name) {
  const item = document.createElement('li');
  item.textContent = `${name} sohbetten ayrıldı.`;
  item.style.fontStyle = 'italic';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user list', function(list) {
  userList.innerHTML = '';
  list.forEach(function(name) {
    const li = document.createElement('li');
    li.textContent = name;
    userList.appendChild(li);
  });
});