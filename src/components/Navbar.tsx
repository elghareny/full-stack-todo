/** @format */

import {NavLink, useLocation} from "react-router-dom";
import Button from "./ui/Button";
import toast from "react-hot-toast";

const Navbar = () => {
	const {pathname} = useLocation();
	const storageKey = "LoggedInUser";
	const userDataString = localStorage.getItem(storageKey);
	const userData = userDataString ? JSON.parse(userDataString) : null;
	const styleLink =
		"  cursor-pointer transition-all duration-300 hover:text-[#0004ff] text-[24px] font-normal hover:font-semibold";

	/* HANDLER */
	const onLogout = () => {
		localStorage.removeItem(storageKey);
		toast.success(
			"You will navigate to the login page after 1 second to login!",
			{
				position: "top-center",
				duration: 2000,
				style: {
					backgroundColor: "black",
					color: "white",
					width: "fit-content",
				},
			},
		);
		location.replace(pathname);

		// setTimeout(() => {
		// 	location.replace(pathname);
		// }, 1000);
	};

	return (
		<nav className='max-w-5xl mx-auto text-[1rem] text-indigo-600 px-8 py-3 rounded-lg mt-5 '>
			<ul className='flex justify-between items-center '>
				<li>
					<NavLink
						to='/'
						className={styleLink}>
						Home{" "}
					</NavLink>
				</li>
				{userData ? (
					<li
						className='flex space-x-5 justify-center items-center
					'>
						<NavLink
							to='/todos'
							className={styleLink}>
							Todos
						</NavLink>
						{/* <NavLink
							to='/profile'
							className={styleLink}>
							Profile{" "}
						</NavLink> */}
						<Button
							className={"hover:text-white text-[20px] font-normal p-2"}
							onClick={onLogout}>
							Logout{" "}
						</Button>
					</li>
				) : (
					<li className='flex justify-center items-center space-x-7'>
						<NavLink
							to='/register'
							className={styleLink}>
							Register{" "}
						</NavLink>
						<NavLink
							to='/login'
							className={styleLink}>
							Login{" "}
						</NavLink>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
