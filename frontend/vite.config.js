import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		// Proxy API calls to backend in development only
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://localhost:5000",
				changeOrigin: true,
				rewrite: (path) => path,
			},
		},
	},
	build: {
		// Optimize build output
		sourcemap: false,
	},
});
