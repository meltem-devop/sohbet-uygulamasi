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
    socket.emit('chat message', { name: nickname, text: input.value });
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = `${msg.name}: ${msg.text}`;
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