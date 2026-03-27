import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAPIEndpoint } from "../utils/apiConfig";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				// CHANGED: Added credentials: "include" for cookie-based auth across domains
				const res = await fetch(getAPIEndpoint("/api/users"), {
					credentials: "include", // Required for CORS with cookies in production
				});
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;
