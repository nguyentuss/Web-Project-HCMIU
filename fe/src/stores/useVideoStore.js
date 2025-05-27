import { create } from "zustand";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

export const useVideoStore = create((set) => ({
	videos: [],
	video: [],
	searchResults: [],
	loading: false,

	setVideos: (videos) => set({ videos }),
	
	createVideo: async (videoData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/videos", videoData, { withCredentials: true });
			set((prevState) => ({
				videos: [...prevState.videos, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},

	fetchAllVideos: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/videos", { withCredentials: true });
			/*
			const token = Cookies.get('token');
			const response = await axios.get("http://localhost:8080/api/videos", {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			});
			console.log(response.data)
			*/
			set({ videos: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch videos", loading: false });
			toast.error(error.response.data.error || "Failed to fetch videos");
		}
	},

	fetchVideo: async (id) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/videos/${id}`, { withCredentials: true });
			set({ video: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch videos", loading: false });
			toast.error(error.response.data.error || "Failed to fetch videos");
		}
	},

	fetchVideosByCategory: async (category) => {
		set({ loading: true });
		try {
			const token = Cookies.get('token');
			const response = await axios.get(`/videos/category/${category}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			});
			set({ videos: response.data.videos, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch videos", loading: false });
			toast.error(error.response.data.error || "Failed to fetch videos");
		}
	},

	fetchVideosBySearch: async (keyword) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/videos/search?title=${keyword}`, { withCredentials: true });
			set({ searchResults: res.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch search results", loading: false });
			toast.error(error.response.data.error || "Failed to fetch search results");
		}
	},
	
	deleteVideo: async (videoId) => {
		set({ loading: true });
		try {
			await axios.delete(`/videos/${videoId}`, { withCredentials: true });
			set((prevVideos) => ({
				videos: prevVideos.videos.filter((video) => video._id !== videoId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete video");
		}
	},
}));