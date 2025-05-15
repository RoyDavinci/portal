import React from "react";

const DashboardPage = () => {
	return (
		<div className='max-w-4xl w-full bg-white p-8 rounded shadow-md mx-auto'>
			<h2 className='text-3xl font-bold text-red-600 text-center mb-6'>
				Welcome to the Admin Dashboard!
			</h2>
			<p className='text-center text-gray-700 text-lg'>
				Select an action from the sidebar to manage users, organizations, or SMS
				groups.
			</p>
		</div>
	);
};

export default DashboardPage;
