/** @format */

import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface IProps {
	isAllowed: boolean;
	redirectPath: string;
	children: ReactNode;
	data?: unknown;
}

const ProtectedRoute = ({isAllowed, redirectPath, data, children}: IProps) => {
	if (!isAllowed)
		return (
			<Navigate
				to={redirectPath}
				replace
				state={data}
			/>
		);
	return children;
};

export default ProtectedRoute;
