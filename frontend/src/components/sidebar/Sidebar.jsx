import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col h-full bg-gray-900 overflow-hidden'>
			{/* HEADER - Search area with fixed height */}
			<div className='p-3 border-b border-gray-700'>
				<SearchInput />
			</div>

			{/* CONVERSATIONS - Scrollable middle area with flex-1 */}
			<div className='flex-1 overflow-y-auto'>
				<Conversations />
			</div>

			{/* FOOTER - Logout button with fixed height at bottom */}
			<div className='p-3 border-t border-gray-700'>
				<LogoutButton />
			</div>
		</div>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
