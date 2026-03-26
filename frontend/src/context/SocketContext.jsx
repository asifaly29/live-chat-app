import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
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
			// Use environment variable for server URL, fallback to production URL
			const serverUrl = import.meta.env.VITE_SERVER_URL || "https://chat-app-yt.onrender.com";

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
				console.log("Online users updated:", users);
			});

			/**
			 * Handle connection events
			 */
			socket.on("connect", () => {
				console.log("✅ Socket connection established");
			});

			socket.on("disconnect", () => {
				console.log("❌ Socket disconnected");
			});

			/**
			 * Handle connection errors
			 */
			socket.on("connect_error", (error) => {
				console.error("Connection error:", error);
			});

			/**
			 * Handle message errors
			 */
			socket.on("messageError", (data) => {
				console.error("Message error:", data.error);
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

