import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiFileText, FiUser, FiClock, FiInbox } from "react-icons/fi";

const UploadedFilesList = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const res = await axios.get("https://bulksms.approot.ng/upload.php");
				if (res.data.status && Array.isArray(res.data.data)) {
					setFiles(res.data.data);
				} else {
					setFiles([]);
				}
			} catch (err) {
				console.error("Failed to load uploaded files", err);
				setError("Failed to load uploaded files");
			} finally {
				setLoading(false);
			}
		};

		fetchFiles();
	}, []);

	if (loading) {
		return (
			<div className='text-center py-10 text-gray-500 animate-pulse'>
				Loading uploaded files...
			</div>
		);
	}

	if (error) {
		return <div className='text-center text-red-500 py-10'>{error}</div>;
	}

	if (files.length === 0) {
		return (
			<div className='text-center text-gray-400 py-10'>
				<FiInbox className='mx-auto text-4xl mb-2' />
				<p className='text-lg font-semibold'>No files at the moment</p>
			</div>
		);
	}

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h2 className='text-2xl font-bold text-center text-blue-800 mb-6'>
				Recently Uploaded Files
			</h2>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{files.map((file) => (
					<div
						key={file.id}
						className='bg-white rounded-lg shadow hover:shadow-lg transition p-5 border border-gray-100'
					>
						<div className='flex items-center space-x-3 mb-4'>
							<FiFileText className='text-blue-600 text-2xl' />
							<h3 className='font-semibold text-lg text-gray-800 truncate'>
								{file.file_name || "Untitled.csv"}
							</h3>
						</div>
						<p className='text-sm text-gray-600 mb-2'>
							<span className='font-medium'>Type:</span>{" "}
							{file.type || "general"}
						</p>
						<p className='text-sm text-gray-600 mb-2'>
							<span className='font-medium'>Message:</span>{" "}
							{file.message?.slice(0, 100)}...
						</p>
						<div className='flex justify-between text-sm text-gray-500 mt-4'>
							<span className='flex items-center gap-1'>
								<FiUser /> {file.full_name || "Unknown"}
							</span>
							<span className='flex items-center gap-1'>
								<FiClock />
								{new Date(file.created_at).toLocaleDateString()}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default UploadedFilesList;
