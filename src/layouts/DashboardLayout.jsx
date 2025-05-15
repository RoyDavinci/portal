// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, UserCircle, Menu } from "lucide-react";
import { FiSend, FiUsers, FiLayers, FiGrid, FiLogOut } from "react-icons/fi";
import {
	Avatar,
	Menu as MuiMenu,
	MenuItem,
	IconButton,
	Tooltip,
} from "@mui/material";

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
		navigate("/login");
	};

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* Sidebar */}
			<aside className='w-64 flex-shrink-0 bg-gray-900 text-white p-6 shadow-md h-screen overflow-y-auto'>
				<h2 className='text-2xl font-bold mb-8'>📨 SMS Portal</h2>
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
						<FiSend className='text-lg' /> Send Multiple SMS
					</Link>
					<Link
						to='/dashboard/formatted-sms'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiSend className='text-lg' /> Send Formatted SMS
					</Link>
					{(currentRole === "admin" || currentRole === "super_admin") && (
						<Link
							to='/dashboard/create_user'
							className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
						>
							<FiUsers className='text-lg' /> Create User
						</Link>
					)}

					{currentRole === "super_admin" && (
						<Link
							to='/dashboard/create_organization'
							className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
						>
							<FiUsers className='text-lg' /> Create Organization
						</Link>
					)}
					<Link
						to='/dashboard/create_sms_group'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiLayers className='text-lg' /> Create SMS Group
					</Link>
					<Link
						to='/dashboard/update_sms_group_numbers'
						className='flex items-center gap-3 px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600 hover:text-white transition-colors'
					>
						<FiLayers className='text-lg' /> Update SMS Numbers
					</Link>
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
				<main className='flex-1 overflow-y-auto p-6 bg-gray-100'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
