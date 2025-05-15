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
	const [messageSummary, setMessageSummary] = useState(null);
	const [deliveryRates, setDeliveryRates] = useState({});
	const [totalMessages, setTotalMessages] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					"https://messaging.approot.ng/ubabulk/portal.php"
				);
				const result = res.data;

				if (result.status === "success") {
					const labels = Object.keys(result.data);
					const counts = labels.map((network) => result.data[network].length);
					const total = counts.reduce((sum, val) => sum + val, 0);

					setChartData({
						labels,
						datasets: [
							{
								label: "Messages Sent Today",
								data: counts,
								backgroundColor: [
									"#1E3A8A", // blue
									"#059669", // green
									"#D97706", // amber
									"#B91C1C", // red
									"#7C3AED", // purple
								],
								borderRadius: 6,
							},
						],
					});

					setTotalMessages(total);
					setMessageSummary(result.data);
					setDeliveryRates(result.delivery_rates || {});
				}
			} catch (error) {
				console.error("Failed to fetch messages data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
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
					{/* Summary Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
						<div className='bg-white p-6 rounded-lg shadow flex items-center space-x-4'>
							<FiMessageCircle className='text-blue-600 text-3xl' />
							<div>
								<p className='text-gray-600'>Total Messages</p>
								<h2 className='text-xl font-bold'>{totalMessages}</h2>
							</div>
						</div>
						<div className='bg-white p-6 rounded-lg shadow flex items-center space-x-4'>
							<FiSmartphone className='text-green-600 text-3xl' />
							<div>
								<p className='text-gray-600'>Networks</p>
								<h2 className='text-xl font-bold'>
									{Object.keys(messageSummary).length}
								</h2>
							</div>
						</div>
						<div className='bg-white p-6 rounded-lg shadow flex items-center space-x-4'>
							<FiActivity className='text-yellow-600 text-3xl' />
							<div>
								<p className='text-gray-600'>Today's Date</p>
								<h2 className='text-xl font-bold'>
									{new Date().toDateString()}
								</h2>
							</div>
						</div>
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
									title: {
										display: false,
										text: "Messages Sent by Network",
									},
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
