/** @format */

import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";
import RootLayout from "../pages/Layout";
import HomePage from "../pages";
import ErrorHandler from "../components/errors/ErrorHandler";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import TodosPage from "../pages/Todos";

const storageKey = "LoggedInUser";
const userDataString = localStorage.getItem(storageKey);
const userData = userDataString ? JSON.parse(userDataString) : null;

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path='/'
			element={<RootLayout />}
			errorElement={<ErrorHandler />}>
			<Route
				index
				element={
					<ProtectedRoute
						isAllowed={userData}
						redirectPath='/login'
						data={userData}>
						<HomePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/todos'
				element={
					<ProtectedRoute
						isAllowed={userData}
						redirectPath='/login'>
						<TodosPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/profile'
				element={
					<ProtectedRoute
						isAllowed={userData}
						redirectPath='/login'>
						<h3>Profile Page</h3>
					</ProtectedRoute>
				}
			/>
			<Route
				path='login'
				element={
					<ProtectedRoute
						isAllowed={!userData}
						redirectPath='/'>
						<LoginPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='register'
				element={
					<ProtectedRoute
						isAllowed={!userData}
						redirectPath='/'>
						<RegisterPage />
					</ProtectedRoute>
				}
			/>
		</Route>,
	),
);

export default router;
