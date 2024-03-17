import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "src/components/layout";
import { Toaster } from "src/components/ui/toaster";
import SocketsProvider from "src/context/socket";
import Board from "src/pages/Board";
import Home from "src/pages/Home";
import Dashboard from "src/pages/Dashboard";

const App = () => {
	return (
		<SocketsProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route index path="/board" element={<Board />} />
					<Route index path="/dashboard" element={<Dashboard />} />
					<Route
						path="*"
						element={<Navigate to={"/board"} replace />}
					/>
				</Route>
			</Routes>
			<Toaster />
		</SocketsProvider>
	);
};

export default App;
