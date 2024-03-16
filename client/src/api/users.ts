import api from "./";

export interface IUser {
	name: string;
	status: number;
	arrival_time: Date | null;
	leave_time: Date | null;
}

interface GetUsersResponse {
	message: string;
	data: IUser[];
}

export const getUsers = () =>
	api.get<GetUsersResponse>("/users").then((data) => data.data);
