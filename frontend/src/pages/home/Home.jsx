import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();

	return (
		<div className='flex h-[60vh] sm:h-[600px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-full max-w-5xl'>
			{/* RESPONSIVE MOBILE/DESKTOP LAYOUT */}
			{/* Mobile: Show sidebar when no chat selected, show chat when selected */}
			{/* Desktop: Always show both side-by-side */}

			{/* Sidebar - Hidden on mobile when chat is open, visible on desktop */}
			<div className={`${
				selectedConversation ? "hidden md:flex" : "flex"
			} flex-col w-full md:w-64 border-r border-slate-500 bg-gray-900`}>
				<Sidebar />
			</div>

			{/* Chat Area - Hidden on mobile when sidebar open, visible on desktop */}
			<div className={`${
				selectedConversation ? "flex" : "hidden md:flex"
			} flex-col flex-1 min-w-0`}>
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
