import { create } from "zustand";
import axios from "../config/axios";
import toast from "react-hot-toast";

export const useCommentStore = create((set) => ({
	comments: [],
    videoComments: [],
	comment: [],
	loadingComment: false,

	setComments: (comments) => set({ comments }),
	
	createComment: async (newComment) => {
		set({ loadingComment: true });
		try {
			const res = await axios.post("/comments", newComment, { withCredentials: true });
			set((prevState) => ({
				comments: [...prevState.comments, res.data],
				loadingComment: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loadingComment: false });
		}
	},

	fetchAllComments: async () => {
		set({ loadingComment: true });
		try {
			const res = await axios.get("/comments", { withCredentials: true });
			set({ videos: res.data, loadingComment: false });
		} catch (error) {
			set({ error: "Failed to fetch comments.", loadingComment: false });
			toast.error(error.response.data.error || "Failed to fetch comments.");
		}
	},

	fetchComment: async (id) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/comments/${id}`, { withCredentials: true });
			set({ comment: res.data, loadingComment: false });
		} catch (error) {
			set({ error: "Failed to fetch comment.", loadingComment: false });
			toast.error(error.response.data.error || "Failed to fetch comment.");
		}
	},

    fetchCommentByVideo: async (id) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/comments/video/${id}`, { withCredentials: true });
			set({ videoComments: res.data, loadingComment: false });
		} catch (error) {
			set({ error: "Failed to fetch comment by video.", loadingComment: false });
			toast.error(error.response.data.error || "Failed to fetch comment by video.");
		}
	},
	
	deleteComment: async (commentId) => {
		set({ loadingComment: true });
		try {
			await axios.delete(`/comments/${commentId}`);
			set((prevComments) => ({
				comments: prevComments.comments.filter((comment) => comment.id !== commentId),
				loadingComment: false,
			}));
		} catch (error) {
			set({ loadingComment: false });
			toast.error(error.response.data.error || "Failed to delete comment.");
		}
	},

	createReply: async (replyData) => {
		set({ loadingComment: true });
		try {
			const res = await axios.post("/comments", replyData, { withCredentials: true });
			set((prevState) => ({
				// Code here
				loadingComment: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loadingComment: false });
		}
	},
}));