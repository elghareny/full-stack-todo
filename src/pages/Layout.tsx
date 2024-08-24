/** @format */

import {Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
	return (
		<div>
			<Navbar />
			<div className='max-w-5xl mx-auto mt-20'>
				<Outlet />
			</div>
		</div>
	);
};

export default RootLayout;
