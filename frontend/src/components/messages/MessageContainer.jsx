import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { IoArrowBack } from "react-icons/io5";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='flex-1 flex flex-col min-w-0'>
			{/* RESPONSIVE: flex-1 for full width on mobile, min-w-0 prevents text overflow */}
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* MOBILE: Back button + Header */}
					<div className='bg-slate-500 px-2 sm:px-4 py-2 mb-2 flex items-center gap-2'>
						{/* Back Button - Mobile only (hidden on md+) */}
						<button
							onClick={() => setSelectedConversation(null)}
							className='md:hidden p-2 hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center'
							title='Back to conversations'
						>
							<IoArrowBack className='w-5 h-5' />
						</button>

						{/* Chat Header Info */}
						<div className='flex-1 min-w-0'>
							<span className='label-text text-xs sm:text-sm'>To:</span>{" "}
							<span className='text-gray-900 font-bold text-sm sm:text-base truncate'>
								{selectedConversation.fullName}
							</span>
						</div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
