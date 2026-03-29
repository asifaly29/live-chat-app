import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form className='p-3 md:p-4 border-t border-slate-200 bg-white sticky bottom-0 z-10' onSubmit={handleSubmit}>
			{/* FACEBOOK MESSENGER STYLE: White background, sticky at bottom, clean input */}
			<div className='w-full relative'>
				<input
					type='text'
					className='border border-slate-300 text-gray-900 text-sm rounded-full block w-full px-4 py-2.5 min-h-[44px] bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors'
					placeholder='Aa'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button 
					type='submit' 
					disabled={loading}
					className='absolute inset-y-0 end-0 flex items-center pe-3 min-w-[44px] justify-center text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors'
				>
					{/* Touch-friendly button size, blue icon, disabled state */}
					{loading ? <div className='loading loading-spinner w-5 h-5'></div> : <BsSend className='w-5 h-5' />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
