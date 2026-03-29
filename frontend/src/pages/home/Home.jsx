import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	return (
		<div className='flex flex-col md:flex-row h-[60vh] sm:h-[600px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-full max-w-5xl'>
			{/* RESPONSIVE: Stack vertically on mobile (flex-col), horizontal on md+ (md:flex-row) */}
			{/* Also set max-w to prevent too-wide desktop, height responsive for mobile */}
			<Sidebar />
			<MessageContainer />
		</div>
	);
};
export default Home;
