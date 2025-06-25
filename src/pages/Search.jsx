import React, { useState } from "react";
import {
	Container,
	TextField,
	Button,
	Box,
	CircularProgress,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import { CSVLink } from "react-csv";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

// Error code descriptions
const errorCodeDescriptions = {
	"000": "Delivered",
	"0dc": "Absent Subscriber",
	206: "Absent Subscriber",
	"21b": "Absent Subscriber",
	"023": "Absent Subscriber",
	"027": "Absent Subscriber",
	"053": "Absent Subscriber",
	"054": "Absent Subscriber",
	"058": "Absent Subscriber",
	439: "Absent subscriber or ported subscriber or subscriber is barred",
	254: "Subscriber's phone inbox is full",
	220: "Subscriber's phone inbox is full",
	120: "Subscriber's phone inbox is full",
	"008": "Subscriber's phone inbox is full",
	255: "Invalid or inactive mobile number or subscriber's phone inbox is full",
	0: "Invalid or inactive mobile number or subscriber's phone inbox is full",
	"20b": "Invalid or inactive mobile number",
	"004": "Invalid or inactive mobile number",
	510: "Invalid or inactive mobile number",
	215: "Invalid or inactive mobile number",
	"20d": "Subscriber is barred on the network",
	130: "Subscriber is barred on the network",
	131: "Subscriber is barred on the network",
	222: "Network operator system failure",
	602: "Network operator system failure",
	306: "Network operator system failure",
	"032": "Network operator system failure or operator not supported",
	"085": "Subscriber is on DND",
	"065": "Message content or senderID is blocked on the promotional route",
	600: "Message content or senderID is blocked on the promotional route",
	"40a": "SenderID not whitelisted on the account",
	"082": "Network operator not supported",
	"00a": "SenderID is restricted by the operator",
	"078": "Restricted message content or senderID is blocked.",
	432: "Restricted message content or senderID is blocked.",
};

// Helper functions
const getErrorMessage = (code) => errorCodeDescriptions[code] || "Unknown";
const formatPhone = (msisdn) =>
	msisdn.startsWith("234") ? "0" + msisdn.slice(3) : msisdn;

const MessageSearch = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleSearch = async () => {
		if (!phoneNumber) {
			alert("Phone number is required");
			return;
		}

		try {
			setLoading(true);
			const response = await axios.get(
				"https://bulksms.approot.ng//search.php",
				{
					params: {
						phoneNumber,
						startDate,
						endDate,
					},
				}
			);
			console.log(response.data);
			setResults(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
			alert("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	const transformDataForCSV = (data) => {
		console.log(data);

		return data.map((row) => ({
			msisdn: "'" + row.msisdn,
			network: row.network, // Process the network
			senderid: row.senderid || "UBA", // Default to "UBA" if not present
			created_at: row.created_at,
			error_code: row.dlr_request, // Safely get error code description
			description: getErrorMessage(row.dlr_request), // Get the status description
			message: row.text,
			requestType: "SMS",
		}));
	};

	return (
		<Container maxWidth='lg' sx={{ mt: 4 }}>
			<Typography variant='h4' gutterBottom>
				Message Search
			</Typography>
			<Box
				component='form'
				sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}
				noValidate
				autoComplete='off'
			>
				<TextField
					label='Phone Number'
					variant='outlined'
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					required
				/>
				<TextField
					label='Start Date'
					type='date'
					InputLabelProps={{ shrink: true }}
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
				/>
				<TextField
					label='End Date'
					type='date'
					InputLabelProps={{ shrink: true }}
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
				/>
				<Button
					variant='contained'
					color='primary'
					onClick={handleSearch}
					disabled={loading}
				>
					{loading ? <CircularProgress size={24} /> : "Search"}
				</Button>
				{results.length > 0 && (
					<CSVLink
						data={transformDataForCSV(results)}
						// filename={"custom-report.csv"}
						filename={`SMS_${new Date().toLocaleDateString()}.csv`}
						className='flex items-center px-3 py-2 bg-[#f24b32] text-[#fff] rounded-md hover:bg-[#9ED686] transition duration-300'
					>
						<FaDownload className='mr-2' /> Export
					</CSVLink>
				)}
			</Box>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<CircularProgress />
				</Box>
			) : results.length > 0 ? (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='messages table'>
						<TableHead>
							<TableRow>
								<TableCell>Phone</TableCell>
								<TableCell>Message</TableCell>
								<TableCell>Status Code</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>DLR Status</TableCell>
								<TableCell>Network</TableCell>
								<TableCell>Sender ID</TableCell>
								<TableCell>Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{results.map((msg) => (
								<TableRow key={msg.id}>
									<TableCell>{formatPhone(msg.msisdn)}</TableCell>
									<TableCell>
										{msg.text.length > 30
											? `${msg.text.slice(0, 30)}...`
											: msg.text}
									</TableCell>
									<TableCell>{msg.dlr_request}</TableCell>
									<TableCell>{getErrorMessage(msg.dlr_request)}</TableCell>
									<TableCell>{msg.dlr_status ?? "Pending"}</TableCell>
									<TableCell>{msg.network}</TableCell>
									<TableCell>{msg.senderid}</TableCell>
									<TableCell>
										{new Date(msg.created_at).toLocaleString()}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<Typography variant='body1' sx={{ mt: 2 }}>
					No results found.
				</Typography>
			)}
		</Container>
	);
};

export default MessageSearch;
