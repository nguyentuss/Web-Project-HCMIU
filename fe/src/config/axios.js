import axios from "axios";
import { useUserStore } from "../stores/useUserStore"

const axiosInstance = axios.create({
	baseURL: "http://localhost:8080/api",
	withCredentials: true, // Always send cookies
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = useUserStore.getState().token;
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

/*
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
*/

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;