import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getAPIEndpoint, API_URL } from "../utils/apiConfig";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const endpoint = getAPIEndpoint(`/api/messages/${selectedConversation._id}`);
				console.log("📥 Fetching messages, API endpoint:", endpoint);
				
				// PRODUCTION-READY FETCH CONFIG:
				// credentials: "include" allows cookies to be sent/received cross-origin
				const res = await fetch(endpoint, {
					credentials: "include", // CRITICAL: Required for CORS with cookies in production
				});
				
				const data = await res.json();
				
				// Network error or non-200 response
				if (!res.ok) {
					console.error("❌ Fetch messages failed:", data);
					throw new Error(data.error || `Failed to fetch messages (${res.status})`);
				}

				if (data.error) {
					console.error("❌ Fetch messages error:", data.error);
					throw new Error(data.error);
				}

				console.log("✅ Messages fetched successfully");
				setMessages(data);
			} catch (error) {
				console.error("❌ Fetch messages request failed:", error.message);
				
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

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
