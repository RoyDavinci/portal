// src/components/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const LoginForm = () => {
	const navigate = useNavigate(); // Use navigate for redirection
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"https://messaging.approot.ng/ubabulk/login.php",
				{
					email,
					password,
				}
			);

			if (response.data.status) {
				toast.success("Login successful!");

				localStorage.setItem("token", response.data.token);
				localStorage.setItem("role", response.data.role);

				navigate("/dashboard");
			} else {
				toast.error(response.data.message || "Invalid credentials.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='max-w-md w-full bg-white p-8 rounded-lg shadow-lg'>
				<h2 className='text-3xl font-semibold text-center text-red-600 mb-6'>
					SMS Portal Login
				</h2>

				<form onSubmit={handleSubmit} className='space-y-6'>
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

					<button
						type='submit'
						className='w-full py-3 mt-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
					>
						Sign In
					</button>
				</form>

				<div className='mt-4 text-center'>
					<a href='#' className='text-sm text-red-600 hover:underline'>
						Forgot Password?
					</a>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
