import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getAPIEndpoint } from "../utils/apiConfig";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			// CHANGED: Added credentials: "include" for cookie-based auth across domains
			const res = await fetch(getAPIEndpoint("/api/auth/logout"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // Required for CORS with cookies in production
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
