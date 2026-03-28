import { useEffect } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";
import { getAPIEndpoint } from "../../utils/apiConfig";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	const { setSelectedConversation, unreadCounts, setUnreadCounts, resetUnreadCount } = useConversation();

	const fetchUnreadCounts = async () => {
		try {
			// CHANGED: Added credentials: "include" for cookie-based auth across domains
			const res = await fetch(getAPIEndpoint("/api/messages/unread"), {
				credentials: "include", // Required for CORS with cookies in production
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			const map = data.reduce((acc, item) => {
				acc[item.senderId] = item.count;
				return acc;
			}, {});
			setUnreadCounts(map);
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		fetchUnreadCounts();
	}, []);

	const handleConversationOpen = async (conversation) => {
		setSelectedConversation(conversation);
		const count = unreadCounts[conversation._id] || 0;

		if (count > 0) {
			try {
				// CHANGED: Added credentials: "include" for cookie-based auth across domains
				await fetch(getAPIEndpoint(`/api/messages/mark-seen/${conversation._id}`), {
					method: "PUT",
					credentials: "include", // Required for CORS with cookies in production
				});
				resetUnreadCount(conversation._id);
			} catch (error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
					unreadCount={unreadCounts[conversation._id] || 0}
					onConversationClick={handleConversationOpen}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
