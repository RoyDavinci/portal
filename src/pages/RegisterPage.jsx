// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match!");
			return;
		}

		try {
			const response = await axios.post(
				"https://messaging.approot.ng/ubabulk/register.php",
				{
					email,
					password,
				}
			);

			if (response.data.status) {
				toast.success("Registration successful!");
				navigate("/login"); // Redirect to login page after successful registration
			} else {
				toast.error(response.data.message || "Registration failed.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='max-w-md w-full bg-white p-8 rounded-lg shadow-lg'>
				<h2 className='text-3xl font-semibold text-center text-red-600 mb-6'>
					Register
				</h2>
				<form onSubmit={handleRegister} className='space-y-6'>
					<div>
						<label htmlFor='email' className='block text-gray-700 font-medium'>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
							required
						/>
					</div>
					<div>
						<label
							htmlFor='password'
							className='block text-gray-700 font-medium'
						>
							Password
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
							required
						/>
					</div>
					<div>
						<label
							htmlFor='confirmPassword'
							className='block text-gray-700 font-medium'
						>
							Confirm Password
						</label>
						<input
							type='password'
							id='confirmPassword'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className='w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
							required
						/>
					</div>
					<button
						type='submit'
						className='w-full py-3 mt-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
					>
						Register
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
