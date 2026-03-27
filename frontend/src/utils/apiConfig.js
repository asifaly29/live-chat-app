/**
 * API Configuration utility
 * Centralizes API URL and Server URL configuration for development and production
 * 
 * CHANGED: Updated for Vercel production deployment
 * Set environment variables in Vercel project settings:
 * - VITE_API_URL: Backend API URL (e.g., https://chat-backend.vercel.app)
 * - VITE_SERVER_URL: WebSocket server URL (e.g., https://chat-backend.vercel.app)
 */

// API URL for REST endpoints
export const API_URL = import.meta.env.VITE_API_URL || "https://live-chat-app-production-69b9.up.railway.app";

// Server URL for Socket.IO connections
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "https://live-chat-app-production-69b9.up.railway.app";

// Helper function to create full API endpoint URL (for production)
export const getAPIEndpoint = (path) => {
	// If path is already absolute (for production), use as is
	if (path.startsWith("http")) {
		return path;
	}
	// For relative paths, prepend API_URL if in production (no proxy available)
	// In development, Vite proxy handles /api/* paths
	if (import.meta.env.DEV) {
		return path; // Use Vite proxy in development
	}
	// In production, use full URL with API_URL
	return `${API_URL}${path}`;
};

export default {
	API_URL,
	SERVER_URL,
	getAPIEndpoint,
};
