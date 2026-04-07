import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const {
		messages,
		setMessages,
		selectedConversation,
		incrementUnreadCount,
		resetUnreadCount,
		unreadCounts,
	} = useConversation();

	useEffect(() => {
		if (!socket) return;

		// Get the latest state values from the component at listener registration time
		const handleNewMessage = (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			// Use the latest values from zustand store (not from closure)
			const { messages: currentMessages, selectedConversation: currentSelected, unreadCounts: currentUnreadCounts } = useConversation.getState();
			
			const isForSelectedConversation = currentSelected && currentSelected._id === newMessage.senderId;

			if (isForSelectedConversation) {
				setMessages([...currentMessages, newMessage]);
				// Reset unread count if viewing this conversation
				if (currentUnreadCounts[newMessage.senderId] > 0) {
					resetUnreadCount(newMessage.senderId);
				}
			} else {
				// Message is for a different conversation, increment unread count
				incrementUnreadCount(newMessage.senderId);
			}
		};

		socket.on("newMessage", handleNewMessage);

		// Cleanup: remove listener
		return () => {
			socket.off("newMessage", handleNewMessage);
		};
	}, [socket, setMessages, incrementUnreadCount, resetUnreadCount]); // Only depend on stable values
};
export default useListenMessages;
