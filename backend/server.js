import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import { initializeSocketHandlers } from './socket/socket.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URL || "http://localhost:3000",
		credentials: true,
		methods: ["GET", "POST"],
	},
});

const PORT = process.env.PORT || 5000;

dotenv.config();

// ===== MIDDLEWARES =====
// Parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

// CORS headers for REST API
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:3000");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		res.sendStatus(200);
	} else {
		next();
	}
});

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ===== SOCKET.IO INITIALIZATION =====
initializeSocketHandlers(io);

// ===== SERVER STARTUP =====
server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`🚀 Server is running on port ${PORT}`);
	console.log(`📱 Socket.IO is connected and listening for events`);
}); 


/*
app.get('/', (req, res) => {
    // root route http://localhost:5000/
  res.send('Server is running!');

});
*/
