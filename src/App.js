// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CreateUserPage from "./pages/CreateUserPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import CreateSmsGroupPage from "./pages/CreateSmsGroupPage";
import UpdateSmsGroupNumbersPage from "./pages/UpdateSmsGroupNumbersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SendSmsPage from "./pages/SendSms";
import SendMultipleSmsPage from "./pages/SendMultipleSms";
import NotFoundPage from "./pages/NotFound";
import SendFormattedSms from "./pages/SendFormattedSms";
import FileUploadServer from "./pages/New";

function App() {
	return (
		<Router>
			<Routes>
				{/* Public Route */}
				<Route path='/login' element={<LoginPage />} />

				{/* Protected Routes */}
				<Route
					path='/dashboard/*'
					element={
						<ProtectedRoute>
							<DashboardLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<DashboardPage />} />
					<Route path='send-sms' element={<SendSmsPage />} />
					<Route path='send-multiple-sms' element={<SendMultipleSmsPage />} />
					<Route path='create_user' element={<CreateUserPage />} />
					<Route
						path='create_organization'
						element={<CreateOrganizationPage />}
					/>
					<Route path='create_sms_group' element={<CreateSmsGroupPage />} />
					<Route
						path='update_sms_group_numbers'
						element={<UpdateSmsGroupNumbersPage />}
					/>
					<Route path='formatted-sms' element={<FileUploadServer />} />
				</Route>

				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

export default App;
