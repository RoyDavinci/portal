import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const CreateUserPage = () => {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("");
	const [password, setPassword] = useState("");
	const [organisations, setOrganisations] = useState([]);
	const [selectedOrg, setSelectedOrg] = useState("");

	const currentRole = localStorage.getItem("role");

	useEffect(() => {
		if (currentRole === "super_admin") {
			axios
				.get("https://messaging.approot.ng/ubabulk/get_organisations.php")
				.then((res) => {
					if (res.data.status && res.data.organisations) {
						setOrganisations(res.data.organisations);
					} else {
						toast.error("Failed to fetch organisations");
					}
				})
				.catch(() => {
					toast.error("An error occurred while fetching organisations.");
				});
		}
	}, [currentRole]);

	const handleCreateUser = async (e) => {
		e.preventDefault();

		try {
			const payload = {
				email,
				role,
				password,
			};

			if (currentRole === "super_admin" && selectedOrg) {
				payload.org_id = selectedOrg;
			}
			const token = localStorage.getItem("token");

			const response = await axios.post(
				"https://messaging.approot.ng/ubabulk/create_user.php",
				payload,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (response.data.status) {
				toast.success("User created successfully!");
			} else {
				toast.error(response.data.message || "Failed to create user.");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	};

	const allowedRoles = [
		{ value: "admin", label: "Admin" },
		{ value: "customer_support", label: "Customer Support" },
		{ value: "technical_support", label: "Technical Support" },
	];

	if (currentRole === "super_admin") {
		allowedRoles.unshift({ value: "super_admin", label: "Super Admin" });
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='max-w-md w-full bg-white p-8 rounded-lg shadow-lg'>
				<h2 className='text-3xl font-semibold text-center text-red-600 mb-6'>
					Create User
				</h2>
				<form onSubmit={handleCreateUser} className='space-y-6'>
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
						<label htmlFor='role' className='block text-gray-700 font-medium'>
							Role
						</label>
						<select
							id='role'
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className='w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
							required
						>
							<option value=''>Select Role</option>
							{allowedRoles.map((r) => (
								<option key={r.value} value={r.value}>
									{r.label}
								</option>
							))}
						</select>
					</div>
					{currentRole === "super_admin" && (
						<div>
							<label
								htmlFor='organisation'
								className='block text-gray-700 font-medium'
							>
								Organisation
							</label>
							<select
								id='organisation'
								value={selectedOrg}
								onChange={(e) => setSelectedOrg(e.target.value)}
								className='w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
								required
							>
								<option value=''>Select Organisation</option>
								{organisations.map((org) => (
									<option key={org.id} value={org.id}>
										{org.name}
									</option>
								))}
							</select>
						</div>
					)}
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
						Create User
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateUserPage;
