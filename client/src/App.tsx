import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "src/components/layout";
import { Toaster } from "src/components/ui/toaster";

import Board from "src/pages/Board";
import Home from "src/pages/Home";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/"
					element={
						<RequireAuth>
							<Layout />
						</RequireAuth>
					}
				>
					<Route index path="/board" element={<Board />} />
					<Route
						path="*"
						element={<Navigate to={"/board"} replace />}
					/>
				</Route>
			</Routes>
			<Toaster />
		</>
	);
};

function RequireAuth({ children }: { children: JSX.Element }) {
	const lsUser = localStorage.getItem("user");

	if (!lsUser) {
		return <Navigate to={"/"} replace />;
	}

	return children;
}

export default App;
