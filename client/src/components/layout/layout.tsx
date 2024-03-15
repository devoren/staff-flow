import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className="flex items-center justify-center w-full">
			<Outlet />
		</div>
	);
};

export default Layout;
