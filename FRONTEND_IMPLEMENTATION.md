# Frontend Implementation Guide - Online Users Indicator

This guide shows you how to implement the online users indicator (green dot) on the frontend using the Socket.IO integration.

---

## 🎯 Display Online Status in Conversations List

### Step 1: Update Conversation Component

**File:** `frontend/src/components/sidebar/Conversation.jsx`

Replace your current Conversation component with this improved version:

```jsx
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();

	// Check if this user is currently online
	const isOnline = onlineUsers.includes(conversation._id);

	const isSelected = selectedConversation?._id === conversation._id;

	return (
		<div
			onClick={() => setSelectedConversation(conversation)}
			className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer transition
				${isSelected ? "bg-sky-500" : ""}
			`}
		>
			<div className="relative">
				{/* User Avatar */}
				<img 
					alt="user avatar" 
					src={conversation.profilePic} 
					className="w-12 h-12 rounded-full object-cover" 
				/>
				
				{/* Online Indicator Dot */}
				{isOnline && (
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
				)}
			</div>

			<div className="flex flex-col flex-1">
				<div className="flex gap-3 justify-between">
					<p className="font-bold text-gray-200">{conversation.fullName}</p>
					{isOnline && <span className="text-xs text-green-500 font-semibold">Online</span>}
				</div>
				<p className="text-sm text-gray-400">{conversation.username}</p>
			</div>
		</div>
	);
};

export default Conversation;
```

---

## 🎯 Display Online Status in Message Header

### Update Message Container Header

**File:** `frontend/src/components/messages/MessageContainer.jsx`

Add online status to the chat header:

```jsx
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { TiMessageDelete } from "react-icons/ti";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();

	const isOnline = onlineUsers.includes(selectedConversation?._id);

	return (
		<div className="md:min-w-[450px] flex flex-col">
			{selectedConversation ? (
				<>
					{/* Header */}
					<div className="bg-slate-500 px-4 py-2 mb-2 rounded-lg flex items-center justify-between">
						<div className="flex items-center gap-2">
							<img
								alt="user avatar"
								src={selectedConversation.profilePic}
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div className="flex flex-col">
								<h3 className="font-bold text-gray-200">
									{selectedConversation.fullName}
								</h3>
								<p className="text-sm text-gray-400">
									{isOnline ? (
										<span className="text-green-500 font-semibold">● Online</span>
									) : (
										<span className="text-gray-500">Offline</span>
									)}
								</p>
							</div>
						</div>

						<button
							onClick={() => setSelectedConversation(null)}
							className="btn btn-circle btn-sm btn-ghost text-2xl"
						>
							<TiMessageDelete />
						</button>
					</div>

					{/* Messages */}
					<Messages />
					<MessageInput />
				</>
			) : (
				<NoChatSelected />
			)}
		</div>
	);
};

export default MessageContainer;
```

---

## 🎯 Modify Your Zustand Store to Include Online Users

**File:** `frontend/src/zustand/useConversation.js`

Add online users tracking:

```javascript
import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) =>
		set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	onlineUsers: [],
	setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
}));

export default useConversation;
```

---

## 🎯 Update SocketContext to Use Zustand

**File:** `frontend/src/context/SocketContext.jsx` (Enhanced Version)

```jsx
import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import useConversation from "../zustand/useConversation";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();
	const { setOnlineUsers: setZustandOnlineUsers } = useConversation();

	useEffect(() => {
		if (authUser) {
			const serverUrl =
				import.meta.env.VITE_SERVER_URL || "https://chat-app-yt.onrender.com";

			const socket = io(serverUrl, {
				query: {
					userId: authUser._id,
				},
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: 5,
			});

			setSocket(socket);

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
				setZustandOnlineUsers(users); // Sync with Zustand store
				console.log("✅ Online users:", users);
			});

			socket.on("connect", () => {
				console.log("✅ Socket connected");
			});

			socket.on("disconnect", () => {
				console.log("❌ Socket disconnected");
				setOnlineUsers([]);
				setZustandOnlineUsers([]);
			});

			return () => {
				socket.close();
			};
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
			setOnlineUsers([]);
			setZustandOnlineUsers([]);
		}
	}, [authUser, setZustandOnlineUsers]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
```

---

## 🎯 CSS Styling Options

### Tailwind CSS (What I used above):

```jsx
// Subtle green dot with border
{isOnline && (
	<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
)}

// Animated pulse effect
{isOnline && (
	<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
)}

// Larger indicator with shadow
{isOnline && (
	<div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
)}
```

### Regular CSS:

```css
.online-indicator {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: #22c55e;
	border: 2px solid white;
	box-shadow: 0 0 4px rgba(34, 197, 94, 0.6);
}

.online-indicator.pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}
```

---

## 🎯 Display Typing Indicator (Bonus)

**File:** `frontend/src/components/messages/MessageContainer.jsx`

```jsx
import { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageContainer = () => {
	const { socket, onlineUsers } = useSocketContext();
	const { selectedConversation } = useConversation();
	const [isTyping, setIsTyping] = useState(false);

	useEffect(() => {
		socket?.on("userTyping", (data) => {
			if (data.senderId === selectedConversation?._id) {
				setIsTyping(true);
			}
		});

		socket?.on("userStoppedTyping", (data) => {
			if (data.senderId === selectedConversation?._id) {
				setIsTyping(false);
			}
		});

		return () => {
			socket?.off("userTyping");
			socket?.off("userStoppedTyping");
		};
	}, [socket, selectedConversation?._id]);

	return (
		<div>
			{isTyping && (
				<div className="flex items-center gap-1 text-sm text-gray-400 italic">
					<span>Typing</span>
					<span className="animate-bounce">.</span>
					<span className="animate-bounce delay-100">.</span>
					<span className="animate-bounce delay-200">.</span>
				</div>
			)}
		</div>
	);
};

export default MessageContainer;
```

---

## 🎯 Add Typing Indicator to Message Input

**File:** `frontend/src/components/messages/MessageInput.jsx`

```jsx
import { useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const MessageInput = () => {
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();
	const [message, setMessage] = useState("");
	const [typingTimeout, setTypingTimeout] = useState(null);

	const handleInputChange = (e) => {
		setMessage(e.target.value);

		// Emit typing event
		socket?.emit("userTyping", {
			receiverId: selectedConversation?._id,
		});

		// Clear existing timeout
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		// Set new timeout to emit stopped typing
		const timeout = setTimeout(() => {
			socket?.emit("userStoppedTyping", {
				receiverId: selectedConversation?._id,
			});
		}, 1000);

		setTypingTimeout(timeout);
	};

	return (
		<form onSubmit={handleSendMessage}>
			<div className="px-4 my-3">
				<div className="w-full relative">
					<input
						type="text"
						className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
						placeholder="Send a message"
						value={message}
						onChange={handleInputChange}
					/>
					<button
						type="submit"
						className="absolute inset-y-0 end-0 flex items-center pe-3"
					>
						<svg
							className="w-4 h-4 text-blue-600 hover:bg-blue-800 rounded-full"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.5 5.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 2.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
						</svg>
					</button>
				</div>
			</div>
		</form>
	);
};

export default MessageInput;
```

---

## ✅ Implementation Checklist

- [ ] Update `Conversation.jsx` with online indicator
- [ ] Update `MessageContainer.jsx` with online status header
- [ ] Update `SocketContext.jsx` to sync with Zustand store
- [ ] Update `useConversation.js` to include `onlineUsers` state
- [ ] Test in browser - open DevTools Network tab
- [ ] Verify green dot appears for online users
- [ ] Test with multiple browser tabs/windows
- [ ] Test disconnection and reconnection

---

## 🔧 Troubleshooting

### Green dot not appearing:

1. Check browser console for errors
2. Verify `onlineUsers` array is being populated:
   ```javascript
   // In browser console:
   console.log(onlineUsers); // Should show array of user IDs
   ```
3. Confirm `selectedConversation` has `_id` field
4. Check Socket.IO connection in Network tab

### Typing indicator not working:

1. Ensure socket event listeners are added
2. Check message input component has the handlers
3. Verify `selectedConversation?._id` is defined
4. Look for console errors in browser DevTools

---

## 🎨 Style Customization

You can customize the online indicator styling:

```jsx
// Option 1: Larger dot with icon
{isOnline && (
	<div className="absolute bottom-0 right-0 flex items-center justify-center w-4 h-4 bg-green-500 rounded-full border-2 border-white">
		<span className="text-xs">✓</span>
	</div>
)}

// Option 2: Status badge
{isOnline && (
	<span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">
		On
	</span>
)}

// Option 3: Ring effect
{isOnline && (
	<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
)}
```

---

## 📚 What's Next?

Now that you have online users working:

1. **Add Message Reactions** - Let users react with emojis
2. **Add Read Receipts** - Show when messages are read
3. **Add User Presence** - Show "Last seen" timestamps
4. **Add Group Chat** - Support conversations with multiple users
5. **Add Media Sharing** - Allow image uploads

Happy coding! 🚀
