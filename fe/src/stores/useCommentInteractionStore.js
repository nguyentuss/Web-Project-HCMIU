import { create } from 'zustand';
import axios from '../config/axios';
import toast from 'react-hot-toast';

export const useCommentInteractionStore = create((set) => ({
    loading: false,
    error: null,

    likeComment: async (commentId, userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/comment-ratings', { commentId, userId, rating: 1 }, { withCredentials: true });
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    removeLike: async (commentId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.delete(`/comment-ratings/${commentId}`,{ withCredentials: true });
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    dislikeComment: async (commentId, userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/comment-ratings', { commentId, userId, rating: -1 }, { withCredentials: true });
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    removeDislike: async (commentId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.delete(`/comment-ratings/${commentId}`,{ withCredentials: true });
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    }
})); 