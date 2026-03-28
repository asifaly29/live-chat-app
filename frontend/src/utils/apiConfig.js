/**
 * API Configuration utility
 * Centralizes API URL and Server URL configuration
 * 
 * Development:
 * - REST API routes through Vite proxy to Railway backend
 * - WebSocket connects directly to Railway
 * 
 * Production:
 * - All requests go directly to Railway backend
 */

// API URL for REST endpoints
// In dev: http://localhost:5173 (Vite proxy routes to Railway)
// In prod: https://live-chat-app-production-69b9.up.railway.app (direct connection)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

// Server URL for Socket.IO connections
// Always connects directly to Railway backend
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://live-chat-app-production-69b9.up.railway.app";

/**
 * Helper function to create full API endpoint URL
 * In development: returns relative path (proxy handles routing)
 * In production: returns full URL to Railway backend
 */
export const getAPIEndpoint = (path) => {
	// If path is already absolute, use as is
	if (path.startsWith("http")) {
		return path;
	}
	
	// In development, use relative paths (Vite proxy will route to Railway)
	// In production, prepend full API_URL
	if (import.meta.env.DEV) {
		// Development: use relative path, Vite proxy routes to Railway
		return path;
	}
	
	// Production: use full URL (no proxy available)
	return `${API_URL}${path}`;
};

export default {
	API_URL,
	SERVER_URL,
	getAPIEndpoint,
};
