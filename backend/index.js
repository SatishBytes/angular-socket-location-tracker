const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Jab user location bhejta hai
  socket.on('sendLocation', (coords) => {
    socket.broadcast.emit('updateLocation', {
      id: socket.id,
      coords
    });
  });

  // Jab user disconnect hota hai
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.broadcast.emit('userDisconnected', socket.id);
  });
});

// Server start
server.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
