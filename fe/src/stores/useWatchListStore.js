import { create } from "zustand";
import axios from "../config/axios";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

export const useWatchListStore = create((set) => ({
	watchList: [],
	loading: false,
	error: null,

	setWatchList: (watchList) => set({ watchList }),
	
	addToWatchList: async (videoId) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.post(`/watchlist/add/${videoId}`, { withCredentials: true });
			set((state) => ({
				watchList: [...state.watchList, response.data],
				loading: false
			}));
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	fetchWatchList: async (userId) => {
		set({ loading: true, error: null });
		try {
			const response = await axios.get(`/watchlist/user/${userId}`, { withCredentials: true });
			set({ watchList: response.data.videos, loading: false });
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	removeFromWatchList: async (videoId) => {
		set({ loading: true, error: null });
		try {
			await axios.delete(`/watchlist/remove/${videoId}`, { withCredentials: true });
			set((state) => ({
				watchList: state.watchList.filter(item => item.id !== videoId),
				loading: false
			}));
		} catch (error) {
			set({ error: error.message, loading: false });
			throw error;
		}
	},

	isInWatchList: (videoId) => {
		return useWatchListStore.getState().watchList.some(item => item.id === videoId);
	},
}));