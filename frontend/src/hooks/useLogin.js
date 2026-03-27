import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { getAPIEndpoint } from "../utils/apiConfig";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);
		try {
			// CHANGED: Added credentials: "include" for cookie-based auth to work across domains
			const res = await fetch(getAPIEndpoint("/api/auth/login"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
				credentials: "include", // Required for CORS with cookies in production
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
		return false;
	}

	return true;
}
