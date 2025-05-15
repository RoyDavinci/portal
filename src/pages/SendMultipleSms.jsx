import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { UploadIcon } from "lucide-react";
import { styled } from "@mui/material/styles";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
const SendMultipleSmsPage = () => {
	const [file, setFile] = useState(null);
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [groups, setGroups] = useState([]);
	const [groupId, setGroupId] = useState("");
	//	'welcome'

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"https://messaging.approot.ng/ubabulk/list_groups.php",
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (response.data.status) {
					setGroups(response.data.groups);
				} else {
					setError(response.data.message || "Failed to load groups.");
				}
			} catch (err) {
				setError("Error loading groups.");
			}
		};

		fetchGroups();
	}, []);

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setError(null); // Clear previous errors
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccessMessage(null);

		if (!file) {
			setError("Please select a file to upload.");
			setLoading(false);
			return;
		}

		if (!text.trim()) {
			setError("Please enter the text message.");
			setLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("text", text);
		if (groupId) {
			formData.append("group_id", String(groupId)); // Send group ID
		}

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"https://messaging.approot.ng/ubabulk/queues.php",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.status) {
				setSuccessMessage(response.data.message);
				setFile(null);
				setText("");
				setGroupId("");
			} else {
				setError(response.data.message || "Failed to process file.");
			}
		} catch (err) {
			setError(err.message || "An error occurred during upload.");
		} finally {
			setLoading(false);
		}
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

	// const parseFile = useCallback((file) => {
	// 	return new Promise((resolve, reject) => {
	// 		const reader = new FileReader();

	// 		reader.onload = (event) => {
	// 			try {
	// 				const data = event.target?.result;
	// 				if (!data) {
	// 					reject(new Error("No data read from file"));
	// 					return;
	// 				}

	// 				let extractedNumbers = [];

	// 				if (file.name.endsWith(".csv")) {
	// 					// Handle CSV
	// 					const text = data;
	// 					const lines = text.split("\n").filter((line) => line.trim() !== "");
	// 					const header = lines[0].split(",").map((h) => h.trim());
	// 					const hasHeader = header.some((h) => isNaN(Number(h)));

	// 					if (hasHeader) {
	// 						extractedNumbers = lines
	// 							.slice(1)
	// 							.map((line) => line.split(",")[0].trim());
	// 					} else {
	// 						extractedNumbers = lines.map((line) => line.split(",")[0].trim());
	// 					}
	// 					extractedNumbers = extractedNumbers.filter((n) => n !== "");
	// 					extractedNumbers = extractedNumbers.map((number) => {
	// 						let formattedNumber = number.replace(/[-/s]/g, "");
	// 						if (formattedNumber.startsWith("0")) {
	// 							formattedNumber = "234" + formattedNumber.slice(1);
	// 						} else if (formattedNumber.startsWith("+")) {
	// 							formattedNumber = formattedNumber.replace("+", "");
	// 						}
	// 						return formattedNumber;
	// 					});
	// 					resolve(extractedNumbers);
	// 				} else if ([".xlsx", ".xls"].some((ext) => file.name.endsWith(ext))) {
	// 					// Handle Excel
	// 					const workbook = XLSX.read(data, { type: "array" });
	// 					const sheetName = workbook.SheetNames[0];
	// 					const worksheet = workbook.Sheets[sheetName];
	// 					const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

	// 					const hasHeader =
	// 						Array.isArray(rawData[0]) &&
	// 						rawData[0].some((h) => isNaN(Number(h)));

	// 					if (hasHeader) {
	// 						extractedNumbers = rawData
	// 							.slice(1)
	// 							.map((row) =>
	// 								Array.isArray(row) ? String(row[0]).trim() : ""
	// 							);
	// 					} else {
	// 						extractedNumbers = rawData.map((row) =>
	// 							Array.isArray(row) ? String(row[0]).trim() : ""
	// 						);
	// 					}
	// 					extractedNumbers = extractedNumbers.filter((n) => n !== "");
	// 					extractedNumbers = extractedNumbers.map((number) => {
	// 						let formattedNumber = number.replace(/[-/s]/g, "");
	// 						if (formattedNumber.startsWith("0")) {
	// 							formattedNumber = "234" + formattedNumber.slice(1);
	// 						} else if (formattedNumber.startsWith("+")) {
	// 							formattedNumber = formattedNumber.replace("+", "");
	// 						}
	// 						return formattedNumber;
	// 					});
	// 					resolve(extractedNumbers);
	// 				} else {
	// 					reject(
	// 						new Error("Unsupported file type.  Use .csv, .xlsx, or .xls")
	// 					);
	// 				}
	// 			} catch (e) {
	// 				reject(new Error("Error parsing file: " + e.message));
	// 			}
	// 		};

	// 		reader.onerror = () => {
	// 			reject(new Error("Error reading file"));
	// 		};

	// 		if (file.name.endsWith(".csv")) {
	// 			reader.readAsText(file);
	// 		} else {
	// 			reader.readAsArrayBuffer(file);
	// 		}
	// 	});
	// }, []);

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
			<div className='w-full max-w-lg bg-white p-8 rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
					Send Multiple SMS
				</h2>

				{error && (
					<div className='mb-4 text-sm text-red-600 text-center border border-red-500 rounded-md p-2 bg-red-100'>
						<span className='font-semibold'>Error: </span>
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div>
						<label
							htmlFor='file'
							className='block text-sm font-medium text-gray-700'
						>
							Upload File (CSV, Excel)
						</label>
						<Button
							component='label'
							variant='outlined'
							className='w-full mt-1'
						>
							<UploadIcon className='mr-2' />
							Choose File
							<VisuallyHiddenInput
								type='file'
								accept='.csv,.xlsx,.xls'
								onChange={handleFileChange}
							/>
						</Button>
						{file && (
							<p className='text-xs text-gray-500 mt-1'>
								Selected file: {file.name}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='text'
							className='block text-sm font-medium text-gray-700'
						>
							Text Message
						</label>
						<TextField
							id='text'
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder='Enter your SMS message here...'
							className='w-full'
							multiline
							rows={4}
							required
						/>
					</div>
					<FormControl fullWidth>
						<InputLabel id='group-select-label'>
							Select SMS Group (Optional)
						</InputLabel>
						<Select
							labelId='group-select-label'
							id='group_id'
							value={groupId}
							label='Select SMS Group (Optional)'
							onChange={(e) => setGroupId(e.target.value)}
						>
							<MenuItem value=''>-- Select Group --</MenuItem>
							{groups.map((group) => (
								<MenuItem key={group.id} value={group.id}>
									{group.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button
						type='submit'
						disabled={loading}
						className='w-full'
						variant='contained'
						color='primary'
					>
						{loading ? "Processing..." : "Upload File"}
					</Button>
				</form>
			</div>
		</div>
	);
};

export default SendMultipleSmsPage;
