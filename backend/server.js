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

// Load environment variables FIRST
dotenv.config();

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
// Health check endpoint
app.get("/", (req, res) => {
	res.status(200).json({ message: "🚀 API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ===== ERROR HANDLING =====
// 404 Not Found Handler
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
	console.error("Error:", err.message);
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({ 
		error: err.message || "Internal Server Error",
		status: statusCode
	});
});

// ===== SOCKET.IO INITIALIZATION =====
initializeSocketHandlers(io);

// ===== SERVER STARTUP =====
server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`🚀 Server is running on port ${PORT}`);
	console.log(`📱 Socket.IO is connected and listening for events`);
	console.log(`🔌 Environment: ${process.env.NODE_ENV || "development"}`);
});
