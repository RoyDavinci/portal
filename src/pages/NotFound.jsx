import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
	return (
		<div className='h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-700 p-4'>
			<AlertTriangle className='text-red-500 mb-4' size={48} />
			<h1 className='text-3xl font-bold mb-2'>404 - Page Not Found</h1>
			<p className='mb-4'>The page you're looking for doesn't exist.</p>
			<Link
				to='/dashboard'
				className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
			>
				Go to Dashboard
			</Link>
		</div>
	);
};

export default NotFoundPage;
