import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/admin.routes.js';
import chatRouter from './routes/chat.route.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

const server = createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    },
});

// Database connection
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}`);
};
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}));
app.use(cookieParser());

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chats', chatRouter);

app.get('/', (req, res) => {
    res.send("API is working");
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Socket.io connection
io.on('connection', (socket) => {
    // console.log('New user connected:', socket.id);

    // Join a chatroom (when user starts chatting)
    socket.on('join_room', (chatRoomId) => {
        socket.join(chatRoomId);
        // console.log(`Socket ${socket.id} joined room: ${chatRoomId}`);
    });

    // Listen for sending message
    socket.on('send_message', (data) => {
        const { chatRoomId, message, senderId } = data;
        // console.log(`Message from ${senderId}: ${message}`);

        // Emit to all sockets in the same room
        io.to(chatRoomId).emit('receive_message', data);
    });

    // Listen for disconnect
    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => console.log("Server running on port", port));
