/** @format */

const TodoSkeleton = () => {
	return (
		<div
			role='status'
			className='max-w-full p-4 space-y-4 divide-y divide-gray-200 rounded  animate-pulse dark:divide-gray-500 md:p-6'>
			<div className='flex items-center justify-between'>
				<div>
					<div className='w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-500'></div>
				</div>
				<div className='flex space-x-2'>
					<div className='h-5 bg-gray-300 rounded-lg dark:bg-gray-500 w-12'></div>
					<div className='h-5 bg-gray-300 rounded-lg dark:bg-gray-500 w-12'></div>
				</div>
			</div>

			<span className='sr-only'>Loading...</span>
		</div>
	);
};

export default TodoSkeleton;
