import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import { authenticateSocket } from './middleware/auth.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Socket.IO for real-time functionality
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected`);
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});