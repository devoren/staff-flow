import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

interface LayoutProps extends PropsWithChildren {}

const Layout: React.FC<LayoutProps> = () => {
	return (
		<div className="flex items-center justify-center w-full">
			<Outlet />
		</div>
	);
};

export default Layout;
