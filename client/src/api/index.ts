import axios from "axios";

export const HOST_URL = import.meta.env.VITE_PUBLIC_HOST_URL;
export const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 30000,
	headers: {
		"ngrok-skip-browser-warning": "69420",
	},
});

export default api;
