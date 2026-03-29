import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { getAPIEndpoint, API_URL } from "../utils/apiConfig";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const endpoint = getAPIEndpoint("/api/auth/signup");
			console.log("📝 Signing up, API endpoint:", endpoint);
			
			// PRODUCTION-READY FETCH CONFIG:
			// - credentials: "include" allows cookies to be sent/received cross-origin
			// - Content-Type: application/json tells backend to expect JSON
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
				credentials: "include", // CRITICAL: Required for CORS with cookies in production
			});

			const data = await res.json();
			
			// Network error or non-200 response
			if (!res.ok) {
				console.error("❌ Signup failed:", data);
				throw new Error(data.error || `Signup failed (${res.status})`);
			}

			if (data.error) {
				console.error("❌ Signup error:", data.error);
				throw new Error(data.error);
			}

			console.log("✅ Signup successful");
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			console.error("❌ Signup request failed:", error.message);
			
			// Provide detailed error message
			if (error instanceof TypeError) {
				// Network error (e.g., "Failed to fetch")
				console.error("📡 Network Error - Possible causes:");
				console.error("   1. Backend unreachable at:", API_URL);
				console.error("   2. CORS configuration issue on backend");
				console.error("   3. Network connectivity problem");
				toast.error("Network error: Cannot reach backend. Check console for details.");
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
