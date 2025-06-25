// src/pages/OtpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const OtpPage = () => {
	const navigate = useNavigate();
	const [otp, setOtp] = useState("");
	const email = localStorage.getItem("email");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const token = sessionStorage.getItem("token");

		try {
			const response = await axios.post(
				"https://bulksms.approot.ng/otp.php",
				{
					otp,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.status) {
				toast.success("OTP verified!");
				localStorage.setItem("otp", otp);
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", response.data.role);
				navigate("/dashboard");
			} else {
				toast.error(response.data.message || "Invalid OTP.");
			}
		} catch (err) {
			toast.error("Verification failed. Try again.");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
				<h2 className='text-2xl font-bold text-center mb-6 text-red-600'>
					Verify OTP
				</h2>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<p className='text-sm text-gray-600'>
						An OTP was sent to <strong>{email}</strong>
					</p>

					<input
						type='text'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						placeholder='Enter OTP'
						className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
						required
					/>

					<button
						type='submit'
						className='w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
					>
						Verify OTP
					</button>
				</form>
			</div>
		</div>
	);
};

export default OtpPage;
