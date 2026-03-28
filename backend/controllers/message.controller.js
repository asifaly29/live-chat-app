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
			seen: false,
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
 * Get unread message counts grouped by sender for logged-in user
 */
export const getUnreadMessages = async (req, res) => {
	try {
		const userId = req.user._id;

		const results = await Message.aggregate([
			{ $match: { receiverId: userId, seen: false } },
			{ $group: { _id: "$senderId", count: { $sum: 1 } } },
			{ $project: { _id: 0, senderId: "$_id", count: 1 } },
		]);

		res.status(200).json(results);
	} catch (error) {
		console.error("Error in getUnreadMessages controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Mark messages from a sender as seen for logged-in user
 */
export const markMessagesAsSeen = async (req, res) => {
	try {
		const senderId = req.params.senderId;
		const receiverId = req.user._id;

		const result = await Message.updateMany(
			{ senderId, receiverId, seen: false },
			{ $set: { seen: true } }
		);

		res.status(200).json({ modifiedCount: result.modifiedCount });
	} catch (error) {
		console.error("Error in markMessagesAsSeen controller:", error.message);
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