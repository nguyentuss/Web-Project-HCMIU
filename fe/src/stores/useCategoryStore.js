import { create } from "zustand";
import axios from "../config/axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
    categories: [], // Ensure initial state is always an array
    loading: false,

	setCategories: (categories) => set({ categories }),

	createCategory: async (categoryData) => {
	    set({ loading: true });
		try {
			const res = await axios.post("/categories", categoryData);
			set((prevState) => ({
				categories: [...prevState.categories, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},

	fetchAllCategories: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/categories");
			set({ categories: res.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch categories", loading: false });
			toast.error(error.response.data.error || "Failed to fetch categories");
		}
	},

	deleteCategory: async (categoryId) => {
		set({ loading: true });
		try {
			await axios.delete(`/categories/${categoryId}`);
			set((prevCategories) => ({
				categories: prevCategories.categories.filter((category) => category.category_id !== categoryId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete category");
		}
	},
}));