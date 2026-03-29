import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji, unreadCount = 0, onConversationClick }) => {
	const { selectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 sm:p-3 py-1 cursor-pointer active:bg-sky-600 transition-colors min-h-[56px] sm:min-h-auto
				${isSelected ? "bg-sky-500" : ""}
			`}
				onClick={() => onConversationClick(conversation)}
			>
				{/* RESPONSIVE: Touch-friendly padding and height, active state for mobile feedback */}
				<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-10 sm:w-12 rounded-full shrink-0'>
						<img src={conversation.profilePic} alt='user avatar' className='object-cover' />
					</div>
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex gap-2 sm:gap-3 justify-between items-center overflow-hidden'>
						<p className='font-bold text-gray-200 text-sm sm:text-base truncate'>{conversation.fullName}</p>
						<div className='flex items-center gap-1 sm:gap-2 shrink-0'>
							{unreadCount > 0 && (
								<span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
									{unreadCount}
								</span>
							)}
							<span className='text-lg sm:text-xl'>{emoji}</span>
						</div>
					</div>
				</div>
			</div>

			{!lastIdx && <div className='divider my-0 py-0 h-1' />}
		</>
	);
};
export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
