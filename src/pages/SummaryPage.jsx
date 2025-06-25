import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import Papa from "papaparse";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const SummaryPage = () => {
	const [text, setText] = useState("");
	const [batchId, setBathId] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [smsType, setSmsType] = useState("");

	const [senderId, setSenderId] = useState("");
	const [sender, setSender] = useState([]);
	const [category, setCategory] = useState([]);
	const [columns, setColumns] = useState([]);
	const [firstRow, setFirstRow] = useState({});
	const [selectedColumn, setSelectedColumn] = useState("");

	const location = useLocation();
	const navigate = useNavigate();
	const files = location.state?.file;

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			const text = e.target.result;

			// Parse CSV using PapaParse
			Papa.parse(text, {
				header: true,
				skipEmptyLines: true,
				complete: function (results) {
					if (results.meta.fields && results.data.length > 0) {
						setColumns(results.meta.fields);
						setFirstRow(results.data[0]);
					}
				},
			});
		};

		reader.readAsText(file);
	};

	useEffect(() => {
		const fetchBatch = async () => {
			try {
				const response = await axios.get(
					`https://bulksms.approot.ng/categories.php?batch_id=${files.batch_id}`
				);

				console.log(response.data);

				if (response.data.status) {
					setCategory(response.data.category);
					setSender(response.data.sender);
				} else {
					setError(response.data.message || "Failed to load groups.");
				}
			} catch (err) {
				setError("Error loading groups.");
			}
		};
		fetchBatch();
	}, []);

	if (!files) {
		navigate("/dashboard");
		return null;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const items = {
			sender_id: senderId,
			message: text,
			msg_cat: smsType,
			batch_id: files.batch_id,
			params1: "first_name",
		};

		try {
			const token = localStorage.getItem("token");
			console.log(token);
			const response = await axios.post(
				"https://bulksms.approot.ng/fileUpload.php",
				items,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.status) {
				toast.success(response.data.message || "SMS Queued successfully");
				setText("");
				navigate("/dashboard");
			} else {
				setError(response.data.message || "Failed to process file.");
			}
		} catch (err) {
			setError(err.message || "An error occurred during upload.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 px-4 py-8'>
			<div className='w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
				<div className='bg-white p-6 rounded-xl shadow'>
					<h2 className='text-2xl font-bold text-blue-800 mb-4 text-center'>
						Send Bulk SMS
					</h2>
					{error && (
						<div className='mb-4 text-sm text-red-700 bg-red-100 border border-red-300 p-2 rounded'>
							<strong>Error:</strong> {error}
						</div>
					)}
					<div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
						<h3 className='text-lg font-semibold text-blue-800 mb-3'>
							Uploaded File Summary
						</h3>
						<ul className='text-sm text-gray-700 space-y-1'>
							<li>
								<strong>File Name:</strong> {files?.file_name}
							</li>
							<li>
								<strong>Batch ID:</strong> {files?.batch_id}
							</li>
							<li>
								<strong>Uploaded By:</strong> {files?.full_name}
							</li>
							<li>
								<strong>Total Recipients:</strong> {files?.total_count}
							</li>
							<li>
								<strong>Unique Numbers:</strong> {files?.total_distinct}
							</li>
							<li>
								<strong>Total Duplicates:</strong>
								{Number(files?.total_count) - Number(files?.total_distinct)}
							</li>
							<li>
								<strong>Uploaded At:</strong> {files?.created_at}
							</li>
							<li>
								<strong>File Link:</strong>
								<a
									href={`https://bulksms.approot.ng${files?.file_path?.replace(
										"/var/www/html/bulksms",
										""
									)}`}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-600 underline'
								>
									View File
								</a>
							</li>
						</ul>
					</div>
					<form onSubmit={handleSubmit} className='space-y-5'>
						{/* Batch ID */}
						<TextField
							label='Batch ID'
							value={files.batch_id}
							onChange={(e) => setBathId(e.target.value)}
							fullWidth
							required
							contentEditable={false}
						/>

						{/* SMS Type */}
						<FormControl fullWidth>
							<InputLabel id='sms-type-label'>SMS Type</InputLabel>
							<Select
								labelId='sms-type-label'
								value={smsType}
								onChange={(e) => setSmsType(e.target.value)}
								label='SMS Type'
								required
							>
								{category.map((item) => {
									return (
										<MenuItem value={item.category_name}>
											{item.category_name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						{/* Sender ID */}
						<FormControl fullWidth>
							<InputLabel id='sender-id-label'>Sender ID</InputLabel>
							<Select
								labelId='sender-id-label'
								value={senderId}
								onChange={(e) => setSenderId(e.target.value)}
								label='Sender ID'
								required
							>
								{sender.map((item) => {
									return (
										<MenuItem value={item.sender_name}>
											{item.sender_name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						<Button
							type='submit'
							disabled={loading}
							fullWidth
							variant='contained'
							color='primary'
						>
							{loading ? "Processing..." : "Send SMS"}
						</Button>
					</form>
				</div>

				{/* Right Panel - Chat Preview */}
				<div className='hidden md:block'>
					<div className='bg-black rounded-2xl shadow-lg h-[500px] w-full max-w-sm mx-auto flex flex-col justify-between overflow-hidden'>
						<div className='flex justify-center py-2'>
							<div className='w-16 h-1.5 bg-gray-600 rounded-full'></div>
						</div>

						<div className='flex-1 overflow-y-auto px-4 py-3 bg-gray-100 space-y-2'>
							{text ? (
								<div className='flex justify-end'>
									<div
										className='bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[75%] shadow text-sm whitespace-pre-line'
										dangerouslySetInnerHTML={{
											__html: (selectedColumn && firstRow[selectedColumn]
												? firstRow[selectedColumn]
												: text
											).replace(/\n/g, "<br />"),
										}}
									></div>
								</div>
							) : (
								<div className='text-gray-500 text-sm text-center mt-20'>
									Your message preview will appear here...
								</div>
							)}
						</div>

						<div className='flex justify-center py-3 bg-gray-800'>
							<div className='w-8 h-1.5 bg-gray-400 rounded-full'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SummaryPage;
