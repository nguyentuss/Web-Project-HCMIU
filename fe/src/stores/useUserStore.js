import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie';

export const useUserStore = create((set) => ({
	user: null,
	userInfo: [],
	token: null,
	loading: false,
	checkingAuth: false,
	isUpdatingProfile: false,

	signup: async ({ username, email, password }) => {
		set({ loading: true });
		try {
			await axios.post("http://localhost:8080/api/auth/signup", { username, email, password });
			toast.success("Signup successful. Please login.");
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during signup");
		} finally {
			set({ loading: false });
		}
	},

	login: async ({ username, password }) => {
		set({ loading: true });
		try {
			const res = await axios.post("http://localhost:8080/api/auth/signin", 
				{ username, password },
				{ withCredentials: true}
			);

			const { ...userData } = res.data;
			const jwtToken = Cookies.get("jwt");

			set({
				user: userData,
				token: jwtToken,
				loading: false
			});
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Login failed");
		}
	},

	logout: async () => {
		try {
			await axios.post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true });
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "Error during logout");
		}
	},

	fetchUser: async (id) => {
		set({ loading: true });
		try {
			const res = await axios.get(`http://localhost:8080/api/users/${id}`, { withCredentials: true });
			set({ userInfo: res.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch user", loading: false });
			toast.error(error.response.data.error || "Failed to fetch user");
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axios.put("http://localhost:8080/api/uploads/avatar", data, { withCredentials: true });
			toast.success("Profile updated successfully");
		} catch (error) {
			toast.error(error.response?.data?.message);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const res = await axios.get("http://localhost:8080/api/auth/me", { withCredentials: true });
			set({
				user: res.data,
				checkingAuth: false
			});
		} catch (error) {
			set({ checkingAuth: false, user: null });
		}
	}
}));
