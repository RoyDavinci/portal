import React, { useState } from "react";
import axios from "axios";
import {
	Button,
	TextField,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
} from "@mui/material";
import { UploadIcon } from "lucide-react";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const SendMultipleSmsPage = () => {
	const [file, setFile] = useState(null);
	const [batchId, setBatchId] = useState("");
	const [costCenter, setCostCenter] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [columns, setColumns] = useState([]);
	const [firstRow, setFirstRow] = useState({});
	const [selectedColumn, setSelectedColumn] = useState("");
	const [message, setMessage] = useState("");
	const [phoneHeader, setPhoneHeader] = useState("");
	const [scheduledAt, setScheduledAt] = useState("");

	const navigate = useNavigate();
	const [smsLength, setSmsLength] = useState(0);
	const [smsPages, setSmsPages] = useState(1);
	const specialChars = ["€", "^", "{", "}", "[", "]", "~", "|"];

	const handleFileChange = (e) => {
		const uploadedFile = e.target.files?.[0];
		if (!uploadedFile) return;

		setFile(uploadedFile);
		setBatchId(new Date().getTime().toString());
		setError(null);

		const reader = new FileReader();
		const isCSV = uploadedFile.name.endsWith(".csv");

		reader.onload = (e) => {
			if (isCSV) {
				const text = e.target.result;
				Papa.parse(text, {
					header: true,
					skipEmptyLines: true,
					complete: function (results) {
						setColumns(results.meta.fields);
						setFirstRow(results.data[0]);
					},
				});
			} else {
				const data = new Uint8Array(e.target.result);
				const workbook = XLSX.read(data, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
					header: 1,
				});

				const headers = sheet[0];
				const values = sheet[1];

				const rowObj = {};
				headers.forEach((key, index) => {
					rowObj[key] = values[index];
				});

				setColumns(headers);
				setFirstRow(rowObj);
			}
		};

		if (isCSV) {
			reader.readAsText(uploadedFile);
		} else {
			reader.readAsArrayBuffer(uploadedFile);
		}
	};

	const calculateSmsPages = (text) => {
		let length = 0;
		for (let char of text) {
			length += specialChars.includes(char) ? 2 : 1;
		}

		let pages = 1;
		if (length > 160 && length <= 306) pages = 2;
		else if (length > 306) pages = Math.ceil(length / 153);
		return { length, pages };
	};

	const handleTextChange = (e) => {
		const value = e.target.value;
		setMessage(value);

		const { length, pages } = calculateSmsPages(value);
		setSmsLength(length);
		setSmsPages(pages);
	};

	const getRenderedMessage = () => {
		if (!message) return "";

		let rendered = message;
		columns.forEach((col) => {
			const placeholder = `[${col}]`;
			const value = firstRow[col] || "";
			rendered = rendered.replaceAll(placeholder, value);
		});

		return rendered;
	};
	const validPhoneHeaders = [
		"phone",
		"msisdn",
		"phone_no",
		"phoneNo",
		"phone_number",
		"PhoneNo",
		"Phone_No",
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setLoading(true);
		setError(null);

		if (!file) {
			setError("Please select a file.");
			setLoading(false);
			return;
		}

		const lowerCaseColumns = columns.map((col) => col.toLowerCase());
		const hasValidPhoneHeader = lowerCaseColumns.some((col) =>
			validPhoneHeaders.includes(col)
		);

		if (!phoneHeader) {
			setError("Please specify the phone number column.");
			setLoading(false);
			return;
		}

		if (!columns.includes(phoneHeader)) {
			setError(
				"The specified phone column does not exist in the uploaded file."
			);
			setLoading(false);
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("cost_cntr", costCenter);
		formData.append("batchId", batchId);
		formData.append("phoneHeader", phoneHeader);
		formData.append("text", message);
		let formattedSchedule = "";
		if (scheduledAt) {
			const date = new Date(scheduledAt);
			const pad = (n) => n.toString().padStart(2, "0");

			formattedSchedule = `${date.getFullYear()}-${pad(
				date.getMonth() + 1
			)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
				date.getMinutes()
			)}:${pad(date.getSeconds())}`;
			formData.append("scheduledAt", formattedSchedule);
		}

		const messagePlaceholders = [...message.matchAll(/\[([^\]]+)\]/g)].map(
			(match) => match[1]
		);

		const usedParams = messagePlaceholders
			// .filter((col) => col.toLowerCase() !== phoneHeader.toLowerCase())
			.slice(0, 5);

		usedParams.forEach((param, index) => {
			formData.append(`params${index + 1}`, param);
		});
		// columns.forEach((param, index) => {
		// 	formData.append(`params${index + 1}`, param);
		// });
		formData.append("paramCount", Number(usedParams.length));

		for (let pair of formData.entries()) {
			console.log(pair[0] + ": " + pair[1]);
		}

		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"https://bulksms.approot.ng/queues2.php",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.status) {
				toast.success(response.data.message || "SMS Queued successfully");
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

	return (
		<div className='min-h-screen bg-gray-100 p-4 flex flex-col md:flex-row gap-6'>
			<div className='w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
					Send File For SMS Processing
				</h2>

				{error && (
					<div className='mb-4 text-sm text-red-600 text-center border border-red-400 rounded-md p-3 bg-red-100'>
						<strong>Error:</strong> {error}
					</div>
				)}

				<form onSubmit={handleSubmit} className='space-y-5'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Upload File (CSV, Excel)
						</label>
						<Button
							component='label'
							variant='outlined'
							fullWidth
							startIcon={<UploadIcon />}
						>
							Choose File
							<VisuallyHiddenInput
								type='file'
								accept='.csv,.xlsx,.xls'
								onChange={handleFileChange}
							/>
						</Button>
						{file && (
							<p className='text-xs text-gray-600 mt-1'>
								Selected file: {file.name}
							</p>
						)}
					</div>

					<TextField
						label='Batch ID'
						value={batchId}
						onChange={(e) => setBatchId(e.target.value)}
						fullWidth
						required
					/>

					<TextField
						label='Cost Center'
						value={costCenter}
						onChange={(e) => setCostCenter(e.target.value)}
						fullWidth
						required
					/>
					<TextField
						label='Phone Number Column'
						placeholder='e.g. phone, msisdn'
						fullWidth
						required
						value={phoneHeader}
						onChange={(e) => setPhoneHeader(e.target.value)}
					/>

					{/* Select Column (Small & Right-Aligned) */}
					{columns.length > 0 && (
						<div className='flex justify-end'>
							<FormControl size='small' className='w-1/2'>
								<InputLabel id='column-label'>Insert Column</InputLabel>
								<Select
									labelId='column-label'
									value={selectedColumn}
									onChange={(e) => {
										const selected = e.target.value;
										setSelectedColumn(selected);
										if (!message.includes(`[${selected}]`)) {
											setMessage((prev) => prev + ` [${selected}]`);
										}
									}}
									label='Insert Column'
								>
									{columns.map((col) => (
										<MenuItem key={col} value={col}>
											{col}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					)}
					<TextField
						label='Scheduled At'
						type='datetime-local'
						value={scheduledAt}
						onChange={(e) => setScheduledAt(e.target.value)}
						fullWidth
						InputLabelProps={{ shrink: true }}
					/>

					<TextField
						label='Message Text'
						value={message}
						onChange={(e) => {
							handleTextChange(e);
						}}
						fullWidth
						multiline
						rows={4}
					/>
					<p className='text-xs text-gray-500 mt-1'>
						Characters: {smsLength} | Pages: {smsPages}
					</p>

					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						disabled={loading}
					>
						{loading ? "Processing..." : "Upload File"}
					</Button>
				</form>
			</div>

			{/* Emulator Preview */}
			<div className='w-full md:w-1/3 bg-[#0e0f11] rounded-[2.5rem] shadow-2xl h-[520px] p-3 flex flex-col justify-between border border-gray-800 relative overflow-hidden'>
				{/* Top Notch */}
				<div className='absolute top-3 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-gray-700 opacity-50'></div>

				{/* Screen */}
				<div className='flex-1 mt-8 mb-6 mx-3 bg-gray-50 rounded-xl shadow-inner p-3 overflow-y-auto custom-scrollbar'>
					{getRenderedMessage() ? (
						<div className='flex justify-end'>
							<div className='bg-gradient-to-br from-blue-600 to-blue-400 text-white px-4 py-2 rounded-2xl shadow-md max-w-[80%] text-sm whitespace-pre-line'>
								{getRenderedMessage()}
							</div>
						</div>
					) : (
						<div className='text-gray-500 text-sm text-center mt-20'>
							Message preview will appear here...
						</div>
					)}
				</div>

				{/* Bottom Dock */}
				<div className='flex justify-center pb-2'>
					<div className='w-12 h-1.5 bg-gray-500 rounded-full'></div>
				</div>
			</div>
		</div>
	);
};

export default SendMultipleSmsPage;

// citize1@

// $escapedPhoneHeader = mysqli_real_escape_string($conn, $phoneHeader);
