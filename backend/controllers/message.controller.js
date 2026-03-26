import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getIO, getUserSocketId } from "../socket/socket.js";

/**
 * Send a message from sender to receiver
 * Saves message to database and emits real-time event via Socket.IO
 */
export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// ===== VALIDATION =====
		if (!message || message.trim() === "") {
			return res.status(400).json({ error: "Message cannot be empty" });
		}

		if (senderId.toString() === receiverId) {
			return res.status(400).json({ error: "Cannot send messages to yourself" });
		}

		// ===== FIND OR CREATE CONVERSATION =====
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// ===== CREATE AND SAVE MESSAGE =====
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// Save both conversation and message in parallel for better performance
		await Promise.all([conversation.save(), newMessage.save()]);

		// ===== EMIT REAL-TIME MESSAGE VIA SOCKET.IO =====
		const io = getIO();
		if (io) {
			const receiverSocketId = getUserSocketId(receiverId);

			if (receiverSocketId) {
				// Emit message only to the specific receiver
				io.to(receiverSocketId).emit("newMessage", {
					_id: newMessage._id,
					senderId: newMessage.senderId,
					message: newMessage.message,
					createdAt: newMessage.createdAt,
				});
				console.log(`✅ Real-time message delivered to receiver ${receiverId}`);
			} else {
				console.log(`⚠️ Receiver ${receiverId} is offline - message saved to database`);
			}
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.error("Error in sendMessage controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Get all messages between sender and a specific user
 */
export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		// ===== VALIDATION =====
		if (senderId.toString() === userToChatId) {
			return res.status(400).json({ error: "Cannot fetch messages with yourself" });
		}

		// ===== FIND CONVERSATION AND GET MESSAGES =====
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) {
			return res.status(200).json([]);
		}

		const messages = conversation.messages;
		res.status(200).json(messages);
	} catch (error) {
		console.error("Error in getMessages controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};