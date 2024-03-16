import api from "./";
import { IUser } from "./users";

interface GetQRResponse {
	message: string;
	data: {
		token: string;
	};
}

export const getQR = () =>
	api.get<GetQRResponse>("/qr").then((data) => data.data);

interface ScanQRRequest {
	name: string;
	token: string;
}

interface ScanQRResponse {
	message: string;
	data: IUser;
}

export const scanQR = (req: ScanQRRequest) =>
	api.post<ScanQRResponse>("/scan", req).then((data) => data.data);
