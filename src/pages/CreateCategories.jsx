import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageMessageCategories = () => {
	const [categoryName, setCategoryName] = useState("");
	const [id, setId] = useState(""); // for update/delete
	const [mode, setMode] = useState("create"); // create, read, update, delete
	const [categories, setCategories] = useState([]);

	const token = localStorage.getItem("token");
	const fetchCategories = async () => {
		try {
			const token = localStorage.getItem("token");

			const formData = new FormData();
			formData.append("action", "read");
			const res = await axios.post(
				"https://bulksms.approot.ng/Messages.php",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (res.data.status && Array.isArray(res.data.data)) {
				setCategories(res.data.data);
			} else {
				toast.error("Failed to fetch categories.");
			}
		} catch (err) {
			console.error(err);
			toast.error("Error fetching categories.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		const endpoint = "https://bulksms.approot.ng/Messages.php";

		switch (mode) {
			case "create":
				formData.append("action", "create");
				formData.append("category_name", categoryName);
				break;
			case "update":
				formData.append("action", "update");
				formData.append("category_name", categoryName);
				formData.append("id", id);
				break;
			case "delete":
				formData.append("action", "delete");
				formData.append("id", id);
				break;
			default:
				return;
		}

		try {
			const res = await axios.post(endpoint, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.data.status) {
				toast.success(res.data.message || "Operation successful");
				fetchCategories();
				setCategoryName("");
				setId("");
			} else {
				toast.error(res.data.message || "Operation failed");
			}
		} catch (error) {
			console.error(error);
			toast.error("An error occurred");
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<div className='max-w-md mx-auto mt-10 p-6 bg-white shadow rounded'>
			<h2 className='text-xl font-semibold mb-4 text-center text-gray-700'>
				Manage Message Categories
			</h2>

			<div className='mb-4'>
				<label className='block font-medium mb-1'>Mode</label>
				<select
					value={mode}
					onChange={(e) => setMode(e.target.value)}
					className='w-full p-2 border rounded'
				>
					<option value='create'>Create</option>
					<option value='read'>Read</option>
					<option value='update'>Update</option>
					<option value='delete'>Delete</option>
				</select>
			</div>
			{mode === "create" && (
				<>
					<input
						type='text'
						className='p-2 mb-10 w-full outline-none border-[#ccc] border-w border-[0.5px]'
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder='Set Category Name'
					/>
				</>
			)}
			{mode === "update" && (
				<div className='mb-4'>
					<label className='block font-medium mb-1'>Select Category</label>
					<select
						className='p-2 mb-10 w-full outline-none border-[#ccc] border-w border-[0.5px]'
						value={id}
						onChange={(e) => setId(e.target.value)}
					>
						<option value=''>Select A category</option>
						{categories.map((item, id) => {
							return (
								<option key={id} value={item.id}>
									{item.category_name}
								</option>
							);
						})}
					</select>
					<input
						type='text'
						className='p-2 mb-10 w-full outline-none border-[#ccc] border-w border-[0.5px]'
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder='Set Category Name'
					/>
				</div>
			)}
			{mode === "delete" && (
				<div className='mb-4'>
					<label className='block font-medium mb-1'>Select Category</label>
					<select
						className='p-2 mb-10 w-full outline-none border-[#ccc] border-w border-[0.5px]'
						value={id}
						onChange={(e) => {
							setId(e.target.value);
						}}
					>
						<option value=''>Select A category</option>
						{categories.map((item, index) => {
							return (
								<option key={index} value={item.id}>
									{item.category_name}
								</option>
							);
						})}
					</select>
				</div>
			)}

			<button
				onClick={handleSubmit}
				className='w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
			>
				Submit
			</button>
		</div>
	);
};

export default ManageMessageCategories;
