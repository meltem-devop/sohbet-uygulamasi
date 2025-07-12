const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const userList = document.getElementById('user-list');
const allUserList = document.getElementById('all-user-list');
const toggleRegisteredBtn = document.getElementById('toggle-registered-btn');
const registeredArrow = document.getElementById('registered-arrow');
const roomModal = document.getElementById('room-modal');
const roomInput = document.getElementById('room-input');
const nicknameInput = document.getElementById('nickname-input');
const joinBtn = document.getElementById('join-btn');
const roomInfo = document.getElementById('room-info');

let nickname = '';
let room = '';

// URL'den oda adını çek
function getRoomFromUrl() {
  const path = window.location.pathname.slice(1);
  return path || '';
}

// Modalı göster
function showRoomModal() {
  roomModal.style.display = "flex";
  roomInput.focus();
}

// Modalı gizle
function hideRoomModal() {
  roomModal.style.display = "none";
}

// Sayfa yüklendiğinde başlat
window.addEventListener('DOMContentLoaded', () => {
  room = getRoomFromUrl();
  nickname = localStorage.getItem('chat_nickname') || '';
  if (!room || !nickname) {
    showRoomModal();
  } else {
    hideRoomModal();
    roomInfo.textContent = `Oda: ${room}`;
    socket.emit('join', { name: nickname, room });
  }
});

// Katıl butonu
joinBtn.addEventListener('click', () => {
  const roomName = roomInput.value.trim().replace(/\s+/g, '-').toLowerCase();
  const nick = nicknameInput.value.trim();
  if (!roomName) {
    roomInput.style.borderColor = "#f00";
    roomInput.focus();
    return;
  }
  if (!nick) {
    nicknameInput.style.borderColor = "#f00";
    nicknameInput.focus();
    return;
  }
  roomInput.style.borderColor = "#c3d3e2";
  nicknameInput.style.borderColor = "#c3d3e2";
  nickname = nick;
  room = roomName;
  localStorage.setItem('chat_nickname', nickname);
  window.location.pathname = '/' + room; // URL değişir, sayfa yeniden yüklenir!
});

// Mesaj gönderme
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value && nickname && room) {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    socket.emit('chat message', {
      name: nickname,
      text: input.value,
      time: `${hour}:${minute}`,
    });
    input.value = '';
  }
});

// Mesaj geçmişi
socket.on('message history', function (msgArray) {
  messages.innerHTML = '';
  msgArray.forEach(function (msg, idx) {
    const item = document.createElement('li');
    item.innerHTML = `<span class="msg-meta">[${msg.time}] ${msg.name}:</span> <span class="msg-text">${msg.text}</span>`;
    if (idx === msgArray.length - 1) {
      item.classList.add('last-message');
    }
    messages.appendChild(item);
  });
  messages.scrollTop = messages.scrollHeight;
});

// Yeni mesaj
socket.on('chat message', function (msg) {
  const last = messages.querySelector('li.last-message');
  if (last) last.classList.remove('last-message');
  const item = document.createElement('li');
  item.innerHTML = `<span class="msg-meta">[${msg.time}] ${msg.name}:</span> <span class="msg-text">${msg.text}</span>`;
  item.classList.add('last-message');
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Katılan kullanıcı
socket.on('user joined', function (data) {
  const item = document.createElement('li');
  if (typeof data === 'string') {
    item.innerHTML = `<span class="msg-meta">${data} sohbete katıldı.</span>`;
  } else {
    item.innerHTML = `<span class="msg-meta">[${data.time}] ${data.name} sohbete katıldı.</span>`;
  }
  item.style.fontStyle = 'italic';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Ayrılan kullanıcı
socket.on('user left', function (data) {
  const item = document.createElement('li');
  if (typeof data === 'string') {
    item.innerHTML = `<span class="msg-meta">${data} sohbetten ayrıldı.</span>`;
  } else {
    item.innerHTML = `<span class="msg-meta">[${data.time}] ${data.name} sohbetten ayrıldı.</span>`;
  }
  item.style.fontStyle = 'italic';
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Online kullanıcılar
socket.on('user list', function (list) {
  userList.innerHTML = '';
  list.forEach(function (name) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="online-dot"></span>${name}`;
    userList.appendChild(li);
  });
});

// Kayıtlı kullanıcılar
socket.on('all user list', function (list) {
  allUserList.innerHTML = '';
  list.forEach(function (name) {
    const li = document.createElement('li');
    li.textContent = name;
    allUserList.appendChild(li);
  });
});

// Kayıtlı kullanıcılar paneli aç/kapa
toggleRegisteredBtn.addEventListener('click', () => {
  const isHidden = allUserList.classList.toggle('hidden');
  registeredArrow.classList.toggle('rotated', isHidden);
});