import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173, // Standard Vite port
		// No proxy needed when using deployed Railway backend
		// API calls will go directly to: https://live-chat-app-production-69b9.up.railway.app
	},
	build: {
		// Optimize build output
		sourcemap: false,
	},
});
