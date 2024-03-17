import { useEffect, useState } from "react";

import { IUser, getUsers } from "src/api/users";
import Loader from "src/components/ui/loader";
import { DataTable, columns } from "src/components/users";

const Dashboard = () => {
	const [users, setUsers] = useState<IUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getUsers().then(({ data }) => {
			setUsers(data);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className="container mx-auto py-10 self-start">
			{isLoading ? (
				<div className="flex justify-center">
					<Loader />
				</div>
			) : (
				<DataTable columns={columns} data={users} />
			)}
		</div>
	);
};

export default Dashboard;
