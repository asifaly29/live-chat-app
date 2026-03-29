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

// ===== ENVIRONMENT VALIDATION =====
// Log configuration on app startup for debugging
if (typeof window !== 'undefined') {
	console.log("🔧 API Configuration:");
	console.log("   Environment:", import.meta.env.MODE);
	console.log("   API_URL:", import.meta.env.VITE_API_URL || "(using default/proxy)");
	console.log("   SERVER_URL:", import.meta.env.VITE_SERVER_URL || "(using default)");
	console.log("   Development Mode:", import.meta.env.DEV);
}

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

/**
 * Health check function to verify backend connectivity
 * Useful for debugging production issues
 */
export const checkBackendHealth = async () => {
	try {
		const endpoint = getAPIEndpoint("/api/health");
		console.log("🏥 Checking backend health at:", endpoint);
		
		const response = await fetch(endpoint, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			console.warn("⚠️  Backend health check failed:", response.status);
			return false;
		}

		const data = await response.json();
		console.log("✅ Backend is healthy:", data);
		return true;
	} catch (error) {
		console.error("❌ Backend health check failed:", error);
		return false;
	}
};

export default {
	API_URL,
	SERVER_URL,
	getAPIEndpoint,
	checkBackendHealth,
};
