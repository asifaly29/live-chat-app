import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto pt-2 sm:pt-4'>
			{/* RESPONSIVE: Touch-friendly logout button size */}
			{!loading ? (
				<BiLogOut className='w-5 sm:w-6 h-5 sm:h-6 text-white cursor-pointer hover:opacity-80 transition-opacity' onClick={logout} />
			) : (
				<span className='loading loading-spinner loading-sm sm:loading-md'></span>
			)}
		</div>
	);
};
export default LogoutButton;
