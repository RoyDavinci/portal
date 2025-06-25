import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import {
	FiMessageCircle,
	FiSmartphone,
	FiUsers,
	FiActivity,
} from "react-icons/fi";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const DashboardPage = () => {
	const [chartData, setChartData] = useState(null);
	const [messageSummary, setMessageSummary] = useState({});
	const [deliveryRates, setDeliveryRates] = useState({});
	const [loading, setLoading] = useState(true);
	const [queuesTotal, setQueuesTotal] = useState(0);
	const [messagesTotal, setMessagesTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalDuplicate, setTotalDuplicate] = useState(0);
	const [isFileProcessing, setIsFileProcessing] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get("https://bulksms.approot.ng//portal.php");
				const result = res.data;

				if (result.status === "success") {
					const labels = Object.keys(result.data);
					const counts = labels.map((network) => result.data[network].length);
					setChartData({
						labels,
						datasets: [
							{
								label: "Messages Sent Today",
								data: counts,
								backgroundColor: [
									"#1E3A8A",
									"#059669",
									"#D97706",
									"#B91C1C",
									"#7C3AED",
								],
								borderRadius: 6,
							},
						],
					});

					setMessageSummary(result.data);
					setDeliveryRates(result.delivery_rates || {});
					setQueuesTotal(result.totals.queues || 0);
					setMessagesTotal(result.totals.messages || 0);
					setTotalPages(result.totals.pages || 0);
					setTotalDuplicate(result.totals.duplicate || 0);
					setIsFileProcessing(result.loading === true);
				}
			} catch (error) {
				console.error("Failed to fetch messages data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		const interval = setInterval(fetchData, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h1 className='text-4xl font-bold text-center text-red-600 mb-6'>
				Messaging Dashboard
			</h1>

			{loading ? (
				<p className='text-center text-gray-500'>Loading message data...</p>
			) : chartData ? (
				<>
					{isFileProcessing && (
						<div className='mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg shadow animate-pulse text-center'>
							<span className='font-semibold'>File upload in progress...</span>{" "}
							We're currently processing your uploaded file. Summary will update
							shortly.
						</div>
					)}

					{/* Summary Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
						{[
							{
								icon: <FiMessageCircle className='text-blue-600 text-3xl' />,
								label: "Total Messages Processed",
								value: messagesTotal,
							},
							{
								icon: <FiMessageCircle className='text-indigo-600 text-3xl' />,
								label: "Total SMS Pages",
								value: totalPages,
							},
							{
								icon: <FiMessageCircle className='text-indigo-600 text-3xl' />,
								label: "Total Duplicates",
								value: totalDuplicate,
							},
							{
								icon: <FiSmartphone className='text-green-600 text-3xl' />,
								label: "Networks",
								value: Object.keys(messageSummary).length,
							},
							{
								icon: <FiUsers className='text-purple-600 text-3xl' />,
								label: "Total Items Pending",
								value: queuesTotal,
							},
							{
								icon: <FiActivity className='text-yellow-600 text-3xl' />,
								label: "Today's Date",
								value: new Date().toDateString(),
							},
						].map((item, idx) => (
							<div
								key={idx}
								className='bg-white p-6 rounded-lg shadow flex items-center space-x-4'
							>
								{item.icon}
								<div>
									<p className='text-gray-600'>{item.label}</p>
									<h2 className='text-xl font-bold'>{item.value}</h2>
								</div>
							</div>
						))}
					</div>

					{/* Bar Chart */}
					<div className='bg-white p-6 rounded-lg shadow mb-10'>
						<h3 className='text-lg font-semibold text-gray-800 mb-4'>
							Messages Sent by Network
						</h3>
						<Bar
							data={chartData}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: { display: false },
								},
							}}
						/>
					</div>

					{/* Detailed Message List */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{Object.entries(messageSummary).map(([network, messages]) => (
							<div key={network} className='bg-white p-5 rounded-lg shadow'>
								<h4 className='text-lg font-bold text-gray-700 mb-2'>
									{network}
								</h4>
								<p className='text-sm text-gray-500 mb-1'>
									{messages.length} messages sent today
								</p>
								<p className='text-sm text-gray-600 mb-2'>
									Delivery Rate:{" "}
									<span className='font-semibold'>
										{deliveryRates[network] ?? 0}%
									</span>
								</p>
								<ul className='text-sm text-gray-700 max-h-44 overflow-y-auto divide-y'>
									{messages.slice(0, 5).map((msg, idx) => (
										<li key={idx} className='py-2'>
											<div className='flex justify-between'>
												<span className='font-medium'>{msg.msisdn}</span>
												<span className='text-gray-400 text-xs'>
													{new Date(msg.created_at).toLocaleTimeString()}
												</span>
											</div>
											<p className='text-gray-600'>{msg.message}</p>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</>
			) : (
				<p className='text-center text-gray-600'>
					No messages found for today.
				</p>
			)}
		</div>
	);
};

export default DashboardPage;
