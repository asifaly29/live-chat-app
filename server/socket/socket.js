/**
 * Socket.IO Configuration and Event Handlers
 * Manages real-time communication, online users tracking, and message broadcasting
 */

import User from "../models/user.model.js";

// Map to store online users: { userId -> socketId }
const userSocketMap = new Map();

// Global io instance
let globalIO = null;

/**
 * Initialize Socket.IO connection handlers
 * @param {Server} io - Socket.IO server instance
 */
export const initializeSocketHandlers = (io) => {
	globalIO = io; // Store io instance globally

	io.on("connection", (socket) => {
		console.log(`📡 User connected: ${socket.id}`);

		// Extract userId from query parameters
		const userId = socket.handshake.query.userId;

		// Store the socket mapping if userId exists
		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`✅ User ${userId} mapped to socket ${socket.id}`);
		}

		// Emit updated online users list to all connected clients
		const onlineUserIds = Array.from(userSocketMap.keys());
		io.emit("getOnlineUsers", onlineUserIds);

		// ===== LISTENING TO EVENTS =====

		/**
		 * Handle new message event
		 * Broadcast message to specific receiver in real-time
		 */
		socket.on("sendMessage", (data) => {
			const { receiverId, message, senderId, senderFullName, senderProfilePic } = data;

			// Make sure receiver exists and sender is authenticated
			if (!receiverId || !senderId) {
				console.error("❌ Invalid message data - missing senderId or receiverId");
				socket.emit("messageError", { error: "Invalid message data" });
				return;
			}

			// Get receiver's socket ID
			const receiverSocketId = userSocketMap.get(receiverId);

			if (receiverSocketId) {
				// Emit message only to the specific receiver (using to)
				io.to(receiverSocketId).emit("newMessage", {
					senderId,
					senderFullName,
					senderProfilePic,
					message,
					createdAt: new Date(),
				});
				console.log(`📨 Message sent from ${senderId} to ${receiverId}`);
			} else {
				console.log(`⚠️ Receiver ${receiverId} is offline - message will be fetched on reconnect`);
			}
		});

		/**
		 * Handle user disconnect
		 */
		socket.on("disconnect", () => {
			console.log(`❌ User disconnected: ${socket.id}`);

			// Remove user from online map
			if (userId) {
				userSocketMap.delete(userId);
				console.log(`➖ User ${userId} removed from online users`);
			}

			// Emit updated online users list to all remaining clients
			const remainingOnlineUsers = Array.from(userSocketMap.keys());
			io.emit("getOnlineUsers", remainingOnlineUsers);
		});

		/**
		 * Handle typing indicator (optional feature for future enhancement)
		 */
		socket.on("userTyping", (data) => {
			const { receiverId } = data;
			const receiverSocketId = userSocketMap.get(receiverId);

			if (receiverSocketId) {
				io.to(receiverSocketId).emit("userTyping", {
					senderId: userId,
					isTyping: true,
				});
			}
		});

		/**
		 * Handle typing stopped
		 */
		socket.on("userStoppedTyping", (data) => {
			const { receiverId } = data;
			const receiverSocketId = userSocketMap.get(receiverId);

			if (receiverSocketId) {
				io.to(receiverSocketId).emit("userStoppedTyping", {
					senderId: userId,
					isTyping: false,
				});
			}
		});
	});
};

/**
 * Get the Socket.IO instance
 * @returns {Server|null} Socket.IO server instance or null if not initialized
 */
export const getIO = () => {
	return globalIO;
};

/**
 * Get online users list
 * @returns {Array} Array of online user IDs
 */
export const getOnlineUsers = () => {
	return Array.from(userSocketMap.keys());
};

/**
 * Get socket ID for a specific user
 * @param {String} userId - User ID
 * @returns {String|null} Socket ID or null if not found
 */
export const getUserSocketId = (userId) => {
	return userSocketMap.get(userId) || null;
};
