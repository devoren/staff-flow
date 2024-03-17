import { useEffect } from "react";

import { getUsers } from "src/api/users";

const Dashboard = () => {
	useEffect(() => {
		getUsers().then(({ data }) => {
			console.log(data);
		});
	}, []);

	return <div>Dashboard</div>;
};

export default Dashboard;
