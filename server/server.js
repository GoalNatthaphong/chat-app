import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import exp from 'constants';

// Create Express app and Http server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, { cors: { origin: '*' } });

// Store online users
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('User Connected', userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User Disconnected', userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Middleware Setup
app.use(express.json({ limit: '4mb' }));
app.use(cors());

// connect to MongoDB
connectDB();

app.use('/api/status', (req, res) => res.send('Server is live'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log('Server running on port: ' + PORT));
}

export default server;
