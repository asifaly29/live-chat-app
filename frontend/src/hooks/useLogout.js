import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getAPIEndpoint, API_URL } from "../utils/apiConfig";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			const endpoint = getAPIEndpoint("/api/auth/logout");
			console.log("🔓 Logging out, API endpoint:", endpoint);
			
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // CRITICAL: Required for CORS with cookies in production
			});
			
			const data = await res.json();
			
			// Network error or non-200 response
			if (!res.ok) {
				console.error("❌ Logout failed:", data);
				throw new Error(data.error || `Logout failed (${res.status})`);
			}

			if (data.error) {
				console.error("❌ Logout error:", data.error);
				throw new Error(data.error);
			}

			console.log("✅ Logout successful");
			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} catch (error) {
			console.error("❌ Logout request failed:", error.message);
			
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

	return { loading, logout };
};
export default useLogout;
