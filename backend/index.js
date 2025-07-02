const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for development
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

// ✅ Store users: { socket.id -> { name, coords } }
const users = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // ✅ Add default user entry
  users.set(socket.id, { name: 'Anonymous', coords: null });

  // ✅ Send the user's own socket ID
  socket.emit('your-id', socket.id);

  // ✅ Send updated user count
  io.emit('users-count', users.size);

  // ✅ Send full user list to all
  emitUserList();

  // ✅ Receive user location + name
  socket.on('send-location', (data) => {
    const { name, coords } = data;

    // Update user data
    users.set(socket.id, { name: name || 'Anonymous', coords });

    // Broadcast updated location
    io.emit('location-update', {
      id: socket.id,
      name: name || 'Anonymous',
      coords,
    });

    // Update everyone
    io.emit('users-count', users.size);
    emitUserList();
  });

  // ✅ Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    users.delete(socket.id);

    // Notify others
    io.emit('user-disconnected', socket.id);
    io.emit('users-count', users.size);
    emitUserList();
  });

  // ✅ Helper to send full user list
  function emitUserList() {
    const userList = Array.from(users.entries()).map(([id, user]) => ({
      id,
      name: user.name,
    }));
    io.emit('users-list', userList);
  }
});

// ✅ Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
