import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getAPIEndpoint, API_URL } from "../utils/apiConfig";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const endpoint = getAPIEndpoint(`/api/messages/send/${selectedConversation._id}`);
			console.log("📤 Sending message, API endpoint:", endpoint);
			
			// PRODUCTION-READY FETCH CONFIG:
			// credentials: "include" allows cookies to be sent/received cross-origin
			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
				credentials: "include", // CRITICAL: Required for CORS with cookies in production
			});
			const data = await res.json();
			
			// Network error or non-200 response
			if (!res.ok) {
				console.error("❌ Send message failed:", data);
				throw new Error(data.error || `Failed to send message (${res.status})`);
			}

			if (data.error) {
				console.error("❌ Send message error:", data.error);
				throw new Error(data.error);
			}

			console.log("✅ Message sent successfully");
			setMessages([...messages, data]);
		} catch (error) {
			console.error("❌ Send message request failed:", error.message);
			
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

	return { sendMessage, loading };
};
export default useSendMessage;
