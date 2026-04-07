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

	// Global error handler for Socket.IO
	io.on("error", (error) => {
		console.error("❌ Socket.IO Server Error:", error);
	});

	io.on("connection", (socket) => {
		console.log(`📡 User connected: ${socket.id}`);

		// Extract userId from query parameters
		const userId = socket.handshake.query.userId;

		// Validate userId exists
		if (!userId) {
			console.warn("⚠️ Connection attempt without userId - disconnecting");
			socket.disconnect();
			return;
		}

		// Store the socket mapping
		userSocketMap.set(userId, socket.id);
		console.log(`✅ User ${userId} mapped to socket ${socket.id}`);
		console.log(`📊 Total online users: ${userSocketMap.size}`);

		// Emit updated online users list to all connected clients
		const onlineUserIds = Array.from(userSocketMap.keys());
		io.emit("getOnlineUsers", onlineUserIds);

		// ===== LISTENING TO EVENTS =====

		/**
		 * Handle new message event
		 * Broadcast message to specific receiver in real-time
		 */
		socket.on("sendMessage", (data, callback) => {
			try {
				const { receiverId, message, senderId, senderFullName, senderProfilePic } = data;

				// Validate message data
				if (!receiverId || !senderId || typeof message !== "string") {
					console.error("❌ Invalid message data:", { receiverId, senderId, messageType: typeof message });
					if (typeof callback === "function") {
						callback({ success: false, error: "Invalid message data" });
					}
					socket.emit("messageError", { error: "Invalid message data" });
					return;
				}

				// Get receiver's socket ID
				const receiverSocketId = userSocketMap.get(receiverId);

				if (receiverSocketId) {
					// Emit message only to the specific receiver
					io.to(receiverSocketId).emit("newMessage", {
						senderId,
						senderFullName,
						senderProfilePic,
						message,
						createdAt: new Date(),
					});
					console.log(`📨 Message sent from ${senderId} to ${receiverId}`);
					
					// Send success callback if provided
					if (typeof callback === "function") {
						callback({ success: true });
					}
				} else {
					console.log(`⚠️ Receiver ${receiverId} is offline - message queued for delivery`);
					// Still consider it success since frontend will handle offline scenarios
					if (typeof callback === "function") {
						callback({ success: true, offline: true });
					}
				}
			} catch (error) {
				console.error("❌ Error handling sendMessage:", error);
				socket.emit("messageError", { error: "Failed to send message" });
				if (typeof callback === "function") {
					callback({ success: false, error: error.message });
				}
			}
		});

		/**
		 * Handle typing indicator
		 */
		socket.on("userTyping", (data) => {
			try {
				const { receiverId } = data;
				if (!receiverId) return;
				
				const receiverSocketId = userSocketMap.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("userTyping", {
						senderId: userId,
						isTyping: true,
					});
				}
			} catch (error) {
				console.error("❌ Error handling userTyping:", error);
			}
		});

		/**
		 * Handle typing stopped
		 */
		socket.on("userStoppedTyping", (data) => {
			try {
				const { receiverId } = data;
				if (!receiverId) return;
				
				const receiverSocketId = userSocketMap.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("userStoppedTyping", {
						senderId: userId,
						isTyping: false,
					});
				}
			} catch (error) {
				console.error("❌ Error handling userStoppedTyping:", error);
			}
		});

		/**
		 * Handle socket errors
		 */
		socket.on("error", (error) => {
			console.error(`❌ Socket error for user ${userId}:`, error);
		});

		/**
		 * Handle user disconnect
		 */
		socket.on("disconnect", (reason) => {
			console.log(`❌ User disconnected: ${socket.id} - Reason: ${reason}`);

			// Remove user from online map
			if (userId) {
				userSocketMap.delete(userId);
				console.log(`➖ User ${userId} removed from online users`);
				console.log(`📊 Total online users: ${userSocketMap.size}`);
			}

			// Emit updated online users list to all remaining clients
			const remainingOnlineUsers = Array.from(userSocketMap.keys());
			io.emit("getOnlineUsers", remainingOnlineUsers);
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
