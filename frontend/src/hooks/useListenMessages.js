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
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			const isForSelectedConversation = selectedConversation && selectedConversation._id === newMessage.senderId;

			if (isForSelectedConversation) {
				setMessages([...messages, newMessage]);
				// Reset unread count if viewing this conversation
				if (unreadCounts[newMessage.senderId] > 0) {
					resetUnreadCount(newMessage.senderId);
				}
			} else {
				// Message is for a different conversation, increment unread count
				incrementUnreadCount(newMessage.senderId);
			}
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages, selectedConversation, incrementUnreadCount, resetUnreadCount, unreadCounts]);
};
export default useListenMessages;
