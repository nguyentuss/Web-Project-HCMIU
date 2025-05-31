import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useVideoStore } from "../stores/useVideoStore";
import { useCategoryStore } from "../stores/useCategoryStore";

const CreateVideoForm = () => {
	const { id } = useParams(); // Get user ID from URL
    const { createVideo, loading } = useVideoStore();
    const { categories, fetchAllCategories } = useCategoryStore();

    useEffect(() => {
		fetchAllCategories();
	}, [fetchAllCategories]);

    const [newVideo, setNewVideo] = useState({
		title: "",
		description: "",
		url: "",
		thumbnailUrl: "",
		userId: id,
        categoryId: null,
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createVideo(newVideo);
			setNewVideo({ title: "", description: "", url: "", thumbnailUrl: "", userId: null, categoryId: null });
		} catch {
			console.log("Error creating a new video");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewVideo({ ...newVideo, image: reader.result });
			};

			reader.readAsDataURL(file); // base64
		}
	};

    return (
		<motion.div
			className='bg-pm-gray shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-white'>Create Video</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-white'>
						Title
					</label>
					<input
						type='text'
						id='title'
						name='title'
						value={newVideo.title}
						onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
						className='mt-1 block w-full bg-primary-text border border-brown-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-brown-500 focus:border-brown-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-white'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newVideo.description}
						onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-primary-text border border-brown-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500 
						 focus:border-brown-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='url' className='block text-sm font-medium text-white'>
						URL
					</label>
					<input
						type='text'
						id='url'
						name='url'
						value={newVideo.url}
						onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
						step='0.1'
						className='mt-1 block w-full bg-primary-text border border-brown-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500
						 focus:border-brown-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='thumbnail' className='block text-sm font-medium text-white'>
						Thumbnail
					</label>
					<input
						type='text'
						id='thumbnail'
						name='thumbnail'
						value={newVideo.thumbnailUrl}
						onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
						step='0.1'
						className='mt-1 block w-full bg-primary-text border border-brown-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500
						 focus:border-brown-500'
						required
					/>
				</div>

                <div>
					<label htmlFor='category' className='block text-sm font-medium text-white'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newVideo.categoryId}
						onChange={(e) => setNewVideo({ ...newVideo, categoryId: e.target.value })}
						className='mt-1 block w-full bg-pm-gray border border-pm-purple rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-pm-purple-hover focus:border-pm-purple-hover'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-pm-purple hover:bg-pm-purple-hover 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							Creating...
						</>
					) : (
						<>
							Create Video
						</>
					)}
				</button>
			</form>
		</motion.div>
    )
}

export default CreateVideoForm
