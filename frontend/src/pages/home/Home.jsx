import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();

	return (
		<div className='w-full h-full flex overflow-hidden'>
			{/* FACEBOOK MESSENGER STYLE LAYOUT */}
			{/* Mobile: Sidebar OR Chat (toggle with selectedConversation) */}
			{/* Desktop: Sidebar AND Chat side-by-side (always both visible) */}

			{/* SIDEBAR - Full width on mobile, fixed 1/3 on desktop */}
			<div className={`${
				selectedConversation ? "hidden" : "flex"
			} md:flex flex-col w-full md:w-1/3 h-full overflow-hidden border-r border-slate-300 bg-white`}>
				<Sidebar />
			</div>

			{/* CHAT AREA - Full width on mobile, fixed 2/3 on desktop */}
			<div className={`${
				selectedConversation ? "flex" : "hidden"
			} md:flex flex-col w-full md:w-2/3 h-full overflow-hidden bg-white`}>
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
