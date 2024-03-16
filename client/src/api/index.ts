import axios from "axios";

export const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 30000,
});

export default api;
