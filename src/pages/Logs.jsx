import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Button,
	CircularProgress,
} from "@mui/material";
import { FaDownload } from "react-icons/fa";

const Logs = () => {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(true);

	const getFiles = async () => {
		try {
			const { data } = await axios.get("https://bulksms.approot.ng/list.php");

			setLoading(false);
			setFiles(data || []);
		} catch (e) {
			console.error("Error fetching file list:", e);
			setLoading(false);
		}
	};

	useEffect(() => {
		getFiles();
	}, []);

	const handleDownload = (filename) => {
		const url = `https://bulksms.approot.ng/downloadcsv.php?file=${filename}`;
		window.location.href = url;
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center'>
				<CircularProgress />
			</div>
		);
	}

	return (
		<div>
			<Typography variant='h4' gutterBottom align='center'>
				Available Files
			</Typography>
			<Grid container spacing={2} justifyContent='center'>
				{files.length > 0 ? (
					files.map((file, index) => (
						<Grid key={index}>
							<Card variant='outlined'>
								<CardContent>
									<Typography variant='body1' gutterBottom>
										{file}
									</Typography>
									<Button
										variant='contained'
										color='error'
										startIcon={<FaDownload />}
										onClick={(e) => {
											e.stopPropagation();
											handleDownload(file);
										}}
										fullWidth
									>
										Download
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))
				) : (
					<Typography
						variant='body1'
						color='textSecondary'
						align='center'
						fullWidth
					>
						No files available.
					</Typography>
				)}
			</Grid>
		</div>
	);
};

export default Logs;
