import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { checkBackendHealth } from "./utils/apiConfig";

function App() {
	const { authUser } = useAuthContext();

	// ===== ENVIRONMENT VALIDATION & HEALTH CHECK =====
	useEffect(() => {
		// Verify API URL is configured
		const apiUrl = import.meta.env.VITE_API_URL;
		const serverUrl = import.meta.env.VITE_SERVER_URL;

		console.log("🚀 App initialized");
		console.log("📍 API URL environment variable:", apiUrl ? "✓ Set" : "✗ Not set (using defaults)");
		console.log("📍 Server URL environment variable:", serverUrl ? "✓ Set" : "✗ Not set (using defaults)");

		// Check backend connectivity on app load (non-blocking)
		if (authUser) {
			checkBackendHealth();
		}
	}, [authUser]);

	return (
		<div className='px-3 sm:px-4 md:px-6 py-2 h-screen flex items-center justify-center'>
			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
