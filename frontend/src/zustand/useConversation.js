import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	unreadCounts: {},
	setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
	incrementUnreadCount: (senderId) =>
		set((state) => ({
			unreadCounts: {
				...state.unreadCounts,
				[senderId]: (state.unreadCounts[senderId] || 0) + 1,
			},
		})),
	resetUnreadCount: (senderId) =>
		set((state) => ({
			unreadCounts: {
				...state.unreadCounts,
				[senderId]: 0,
			},
		})),
}));

export default useConversation;
