/**
 * API Configuration utility
 * Centralizes API URL and Server URL configuration
 * Updated to work with deployed Railway backend
 * 
 * Environment variables:
 * - VITE_API_URL: Backend API URL (https://live-chat-app-production-69b9.up.railway.app)
 * - VITE_SERVER_URL: WebSocket server URL (https://live-chat-app-production-69b9.up.railway.app)
 */

// API URL for REST endpoints
export const API_URL = import.meta.env.VITE_API_URL || "https://live-chat-app-production-69b9.up.railway.app";

// Server URL for Socket.IO connections
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://live-chat-app-production-69b9.up.railway.app";

/**
 * Helper function to create full API endpoint URL
 * Always uses the API_URL from environment variables
 * No longer relies on Vite proxy
 */
export const getAPIEndpoint = (path) => {
	// If path is already absolute, use as is
	if (path.startsWith("http")) {
		return path;
	}
	// Always prepend API_URL for full URL (Railway backend requires this)
	return `${API_URL}${path}`;
};

export default {
	API_URL,
	SERVER_URL,
	getAPIEndpoint,
};
