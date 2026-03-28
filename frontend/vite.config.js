import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		// Proxy /api calls to Railway backend to avoid CORS issues in development
		proxy: {
			"/api": {
				target: "https://live-chat-app-production-69b9.up.railway.app",
				changeOrigin: true,
				rewrite: (path) => path,
				secure: false, // Allow self-signed certificates if needed
			},
		},
	},
	build: {
		// Optimize build output
		sourcemap: false,
	},
});
