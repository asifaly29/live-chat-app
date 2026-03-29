import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { SERVER_URL } from "../utils/apiConfig";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			// Use SERVER_URL from centralized configuration
			const serverUrl = SERVER_URL;
			console.log("🔌 Socket.IO connecting to:", serverUrl);

			const socket = io(serverUrl, {
				query: {
					userId: authUser._id,
				},
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: 5,
			});

			setSocket(socket);

			// ===== SOCKET EVENT LISTENERS =====

			/**
			 * Receive online users list from server
			 * Updates whenever a user connects or disconnects
			 */
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
				console.log("👥 Online users updated:", users);
			});

			/**
			 * Handle connection events
			 */
			socket.on("connect", () => {
				console.log("✅ Socket.IO connection established");
				console.log("   User ID:", authUser._id);
				console.log("   Socket ID:", socket.id);
			});

			socket.on("disconnect", () => {
				console.log("⚠️  Socket.IO disconnected");
			});

			/**
			 * Handle connection errors
			 */
			socket.on("connect_error", (error) => {
				console.error("❌ Socket.IO connection error:", error);
				console.error("   This could indicate:");
				console.error("   1. Backend is down or unreachable");
				console.error("   2. CORS configuration issue");
				console.error("   3. Invalid server URL:", serverUrl);
			});

			/**
			 * Handle message errors
			 */
			socket.on("messageError", (data) => {
				console.error("❌ Socket.IO message error:", data.error);
			});

			// Cleanup on unmount
			return () => {
				socket.close();
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

