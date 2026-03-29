const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className='flex flex-col sm:flex-row gap-4 sm:gap-6 py-2'>
			{/* RESPONSIVE: Stack vertically on mobile, horizontally on sm+ */}
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer min-h-[44px] ${selectedGender === "male" ? "selected" : ""} `}>
					<span className='label-text text-sm sm:text-base'>Male</span>
					<input
						type='checkbox'
						className='checkbox border-slate-900 checked:border-blue-500'
						checked={selectedGender === "male"}
						onChange={() => onCheckboxChange("male")}
					/>
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer min-h-[44px] ${selectedGender === "female" ? "selected" : ""}`}>
					<span className='label-text text-sm sm:text-base'>Female</span>
					<input
						type='checkbox'
						className='checkbox border-slate-900 checked:border-blue-500'
						checked={selectedGender === "female"}
						onChange={() => onCheckboxChange("female")}
					/>
				</label>
			</div>
		</div>
	);
};
export default GenderCheckbox;

// STARTER CODE FOR THIS FILE
// const GenderCheckbox = () => {
// 	return (
// 		<div className='flex'>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Male</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 			<div className='form-control'>
// 				<label className={`label gap-2 cursor-pointer`}>
// 					<span className='label-text'>Female</span>
// 					<input type='checkbox' className='checkbox border-slate-900' />
// 				</label>
// 			</div>
// 		</div>
// 	);
// };
// export default GenderCheckbox;
