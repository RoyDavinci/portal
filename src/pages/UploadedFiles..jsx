import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiFileText, FiUser, FiClock, FiInbox, FiSearch } from "react-icons/fi";

const UploadedFilesList = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterDate, setFilterDate] = useState("");

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

		const interval = setInterval(fetchFiles, 3000);
		fetchFiles(); // initial load

		return () => clearInterval(interval); // cleanup
	}, []);

	const filteredFiles = files.filter((file) => {
		const nameMatch = file.file_name
			?.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const dateMatch = filterDate
			? file.created_at?.startsWith(filterDate)
			: true;
		return nameMatch && dateMatch;
	});

	if (loading) {
		return (
			<div className='text-center py-20 text-gray-500 animate-pulse'>
				Loading uploaded files...
			</div>
		);
	}

	if (error) {
		return (
			<div className='text-center text-red-500 py-20 font-medium'>{error}</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 py-10'>
			<h2 className='text-3xl font-bold text-center text-blue-900 mb-8'>
				Recently Uploaded Files
			</h2>

			{/* Filters */}
			<div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-8'>
				<div className='flex items-center w-full md:w-1/2 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-300'>
					<FiSearch className='text-gray-400 mr-2 text-lg' />
					<input
						type='text'
						placeholder='Search by file name...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full bg-transparent focus:outline-none text-sm'
					/>
				</div>
				<input
					type='date'
					value={filterDate}
					onChange={(e) => setFilterDate(e.target.value)}
					className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
				/>
			</div>

			{/* File Cards */}
			{filteredFiles.length === 0 ? (
				<div className='text-center text-gray-400 py-16'>
					<FiInbox className='mx-auto text-5xl mb-3' />
					<p className='text-lg font-medium'>No files match your search</p>
				</div>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{filteredFiles.map((file) => (
						<Link
							key={file.id}
							to='/dashboard/summary'
							state={{ file }}
							className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out block'
						>
							<div className='flex items-center gap-3 mb-4'>
								<FiFileText className='text-blue-600 text-2xl' />
								<h3 className='font-semibold text-lg text-gray-800 truncate'>
									{file.file_name || "Untitled.csv"}
								</h3>
							</div>
							<div className='text-sm text-gray-600 space-y-1'>
								<p>
									<span className='font-medium'>Type:</span>{" "}
									{file.type || "General"}
								</p>
								<p>
									<span className='font-medium'>Batch ID:</span> {file.batch_id}
								</p>
								<p className='break-words'>
									<span className='font-medium'>Message:</span>{" "}
									{file.message?.slice(0, 100) || "N/A"}...
								</p>
							</div>
							<div className='flex justify-between items-center text-xs text-gray-500 mt-4'>
								<span className='flex items-center gap-1'>
									<FiUser /> {file.full_name || "Unknown"}
								</span>
								<span className='flex items-center gap-1'>
									<FiClock /> {file.created_at}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default UploadedFilesList;
