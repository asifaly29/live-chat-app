import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='flex flex-col w-full h-full overflow-x-hidden'>
			{/* RESPONSIVE: Sidebar takes full height, padding adjusts for mobile/desktop */}
			<div className='p-2 sm:p-4'>
				<SearchInput />
			</div>
			<div className='divider px-3 my-2 md:my-4'></div>
			<Conversations />
			<LogoutButton />
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
