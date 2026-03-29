const MessageSkeleton = () => {
	return (
		<>
			{/* RESPONSIVE: Skeleton loaders with responsive sizes */}
			<div className='flex gap-2 sm:gap-3 items-center mb-2'>
				<div className='skeleton w-8 sm:w-10 h-8 sm:h-10 rounded-full shrink-0'></div>
				<div className='flex flex-col gap-1 flex-1'>
					<div className='skeleton h-3 sm:h-4 w-32 sm:w-40'></div>
					<div className='skeleton h-3 sm:h-4 w-24 sm:w-40'></div>
				</div>
			</div>
			<div className='flex gap-2 sm:gap-3 items-center justify-end mb-2'>
				<div className='flex flex-col gap-1'>
					<div className='skeleton h-3 sm:h-4 w-24 sm:w-40'></div>
				</div>
				<div className='skeleton w-8 sm:w-10 h-8 sm:h-10 rounded-full shrink-0'></div>
			</div>
		</>
	);
};
export default MessageSkeleton;
