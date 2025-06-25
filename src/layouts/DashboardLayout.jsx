// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, UserCircle, Menu } from "lucide-react";
import { FiSend, FiUsers, FiLayers, FiGrid, FiFileText } from "react-icons/fi";
import {
	Avatar,
	Menu as MuiMenu,
	MenuItem,
	IconButton,
	Tooltip,
} from "@mui/material";
import logo from "../assets/download.png";
import backgroundImage from "../assets/para.png";

const DashboardLayout = () => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const currentRole = localStorage.getItem("role");

	console.log(currentRole);

	const handleLogout = () => {
		localStorage.clear();
		navigate("/");
	};

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* Sidebar */}
			<aside className='w-64 flex-shrink-0 bg-gray-900 text-white p-6 shadow-md h-screen overflow-y-auto'>
				<div className='flex items-center p-4 rounded-lg shadow space-x-4'>
					<img
						src={backgroundImage}
						alt='logo'
						className='w-10 h-10 rounded-full'
					/>
					<h2 className='text-xl font-bold text-white'>SMS Portal</h2>
				</div>

				<nav className='space-y-2'>
					<Link
						to='/dashboard'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiGrid className='text-lg' /> Dashboard
					</Link>
					<Link
						to='/dashboard/send-sms'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiSend className='text-lg' /> Send SMS
					</Link>
					<Link
						to='/dashboard/send-multiple-sms'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiSend className='text-lg' /> Upload File
					</Link>
					<Link
						to='/dashboard/uploaded_files'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiFileText className='text-lg' /> Uploaded Files
					</Link>

					<Link
						to='/dashboard/search'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiSend className='text-lg' /> Search
					</Link>
					<Link
						to='/dashboard/categories'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiSend className='text-lg' /> Create SMS Category
					</Link>
					{(currentRole === "admin" || currentRole === "super_admin") && (
						<Link
							to='/dashboard/create_user'
							className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
						>
							<FiUsers className='text-lg' /> Create User
						</Link>
					)}
				</nav>
			</aside>

			{/* Main Content Wrapper */}
			<div className='flex-1 flex flex-col h-screen overflow-hidden'>
				{/* Header */}
				<header className='flex justify-between items-center bg-white p-4 shadow-sm border-b flex-shrink-0'>
					<div>
						<h1 className='text-lg font-semibold text-gray-700'>
							Welcome, Admin
						</h1>
						<p className='text-sm text-gray-500'>Manage your SMS operations</p>
					</div>

					<div className='flex items-center gap-4'>
						<Tooltip title='Account Settings'>
							<IconButton onClick={handleMenuOpen}>
								<Avatar sx={{ bgcolor: "#1e40af" }}>
									<UserCircle size={20} />
								</Avatar>
							</IconButton>
						</Tooltip>
						<MuiMenu
							anchorEl={anchorEl}
							open={open}
							onClose={handleMenuClose}
							onClick={handleMenuClose}
							PaperProps={{
								elevation: 2,
								sx: {
									mt: 1,
									borderRadius: 2,
									minWidth: 180,
								},
							}}
						>
							<MenuItem onClick={() => navigate("/dashboard/settings")}>
								<Settings size={16} className='mr-2' />
								Settings
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<LogOut size={16} className='mr-2' />
								Logout
							</MenuItem>
						</MuiMenu>
					</div>
				</header>

				{/* Scrollable Content */}
				<main className='relative flex-1 overflow-y-auto p-6 pb-20'>
					<div className='relative min-h-full'>
						{/* Background */}
						<div
							className='absolute inset-0 z-0'
							style={{
								backgroundImage: `url(${logo})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundRepeat: "no-repeat",
								opacity: 0.2,
							}}
						></div>

						{/* Foreground */}
						<div className='relative z-10 bg-white bg-opacity-80 p-4 rounded-lg shadow-md'>
							<Outlet />
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
