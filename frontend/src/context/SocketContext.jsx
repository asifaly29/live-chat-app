import { createContext, useState, useEffect, useContext, useRef } from "react";
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
	const socketRef = useRef(null); // Keep reference to prevent re-creation

	useEffect(() => {
		if (authUser && !socketRef.current) {
			// Only create socket if it doesn't exist
			const serverUrl = SERVER_URL;
			console.log("🔌 Socket.IO connecting to:", serverUrl);

			const newSocket = io(serverUrl, {
				query: {
					userId: authUser._id,
				},
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: Infinity, // Keep trying to reconnect
				transports: ["websocket", "polling"], // Support both transports
			});

			socketRef.current = newSocket;
			setSocket(newSocket);

			// ===== SOCKET EVENT LISTENERS =====

			/**
			 * Receive online users list from server
			 * Updates whenever a user connects or disconnects
			 */
			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
				console.log("👥 Online users updated:", users);
			});

			/**
			 * Handle connection events
			 */
			newSocket.on("connect", () => {
				console.log("✅ Socket.IO connection established");
				console.log("   User ID:", authUser._id);
				console.log("   Socket ID:", newSocket.id);
			});

			newSocket.on("disconnect", (reason) => {
				console.warn("⚠️  Socket.IO disconnected. Reason:", reason);
				// Auto-reconnect is handled by reconnection option above
			});

			newSocket.on("reconnect", () => {
				console.log("🔄 Socket.IO reconnected successfully");
			});

			newSocket.on("reconnect_attempt", () => {
				console.log("🔄 Attempting to reconnect Socket.IO...");
			});

			/**
			 * Handle connection errors
			 */
			newSocket.on("connect_error", (error) => {
				console.error("❌ Socket.IO connection error:", error);
				console.error("   Error details:", error.message);
				console.error("   Server URL:", serverUrl);
			});

			/**
			 * Handle message errors
			 */
			newSocket.on("messageError", (data) => {
				console.error("❌ Socket.IO message error:", data.error);
			});

			// Cleanup on unmount
			return () => {
				if (socketRef.current) {
					socketRef.current.disconnect();
					socketRef.current = null;
					setSocket(null);
				}
			};
		} else if (!authUser && socketRef.current) {
			// Disconnect if user logs out
			socketRef.current.disconnect();
			socketRef.current = null;
			setSocket(null);
		}
	}, [authUser]); // Only depend on authUser - stable dependency

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};

