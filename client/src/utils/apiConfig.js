/**
 * API Configuration utility
 * Centralizes API URL and Server URL configuration for development and production
 * 
 * CHANGED: Updated for Render production deployment
 * Set environment variables in Render project settings:
 * - VITE_BACKEND_URL: Backend API URL (e.g., https://your-backend.onrender.com)
 */

// API URL for REST endpoints
export const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Server URL for Socket.IO connections
export const SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
