import { Link, Outlet, useLocation } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

const Layout = () => {
	const location = useLocation();

	return (
		<div className="flex flex-col items-center w-full h-dvh">
			<NavigationMenu className="pt-4">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							active={location.pathname === "/"}
							asChild
							className={`${navigationMenuTriggerStyle()} data-[active]:bg-accent/60`}
						>
							<Link to="/">Home</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							active={location.pathname === "/board"}
							asChild
							className={`${navigationMenuTriggerStyle()} data-[active]:bg-accent/60`}
						>
							<Link to="/board">Board</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink
							active={location.pathname === "/dashboard"}
							asChild
							className={`${navigationMenuTriggerStyle()} data-[active]:bg-accent/60`}
						>
							<Link to="/dashboard">Dashboard</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<div className="flex items-center justify-center w-full h-dvh">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
