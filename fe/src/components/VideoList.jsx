import React, { useEffect, useState } from 'react';

import { useVideoStore } from '../stores/useVideoStore';
import { useCategoryStore } from '../stores/useCategoryStore';

import { TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon, PencilIcon } from '@heroicons/react/24/solid';
import OptimizedImage from '../components/OptimizedImage';
import toast from 'react-hot-toast';

const VideoList = () => {
    const { videos, loading, fetchAllVideos, deleteVideo, updateVideo } = useVideoStore();
    const { categories, fetchAllCategories } = useCategoryStore();
    const [editingVideo, setEditingVideo] = useState(null);
    const [editedVideo, setEditedVideo] = useState({
        title: '',
        description: '',
        url: '',
        thumbnailUrl: '',
        categoryId: null
    });

    useEffect(() => {
        fetchAllVideos();
        fetchAllCategories();
    }, [fetchAllVideos, fetchAllCategories]);

    const handleDeleteVideo = async (videoId) => {
        try {
            await deleteVideo(videoId);
            toast.success('Removed video');
        } catch (error) {
            toast.error('Failed to remove video');
        }
    };

    const handleEditClick = (video) => {
        setEditingVideo(video.id);
        setEditedVideo({
            title: video.title,
            description: video.description,
            url: video.url,
            thumbnailUrl: video.thumbnailUrl,
            categoryId: Number(video.categoryId)
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateVideo(editingVideo, {
                ...editedVideo,
                categoryId: Number(editedVideo.categoryId)
            });
            toast.success('Video updated successfully');
            setEditingVideo(null);
        } catch (error) {
            toast.error('Failed to update video');
        }
    };

    console.log(editedVideo)

    if (loading) {
        return (
            <div className="bg-transparent text-white flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                Loading videos...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {videos.length === 0 ? (
                <p className="text-gray-400">No videos available!</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {videos.map((item) => (
                        <div key={item.id}>
                            <div className="flex items-center justify-between px-5 py-2 rounded-lg bg-se-gray hover:bg-pm-purple-hover transition-colors">
                                <div 
                                    className="flex gap-3 cursor-pointer flex-1"
                                    onClick={() => navigate(`/watch/${item.id}`)}
                                >
                                    <OptimizedImage 
                                        src={`../assets/${item.thumbnailUrl}`} 
                                        alt={item.title} 
                                        className="max-w-32 aspect-[16/9] object-cover rounded-lg" 
                                    />
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl text-white font-semibold line-clamp-1">{item.title}</span>
                                            <span className="px-3 text-white bg-pm-purple rounded-full">{item.categoryName}</span>
                                        </div>

                                        <span className="flex items-center gap-2 text-sm text-gray-400">
                                            <StarIcon className="w-3" />
                                            {item.averageRating}
                                        </span>
                                        <span className="text-sm text-gray-400">{item.viewCount} views</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <button 
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 hover:bg-pm-purple rounded-full transition-colors cursor-pointer"
                                    >
                                        <PencilIcon className="w-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteVideo(item.id)}
                                        className="p-2 hover:bg-red-400 rounded-full transition-colors cursor-pointer"
                                    >
                                        <TrashIcon className="w-5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Edit Form */}
                            {editingVideo === item.id && (
                                <div className="mt-2 bg-pm-gray p-4 rounded-lg">
                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-white">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                value={editedVideo.title}
                                                onChange={(e) => setEditedVideo({ ...editedVideo, title: e.target.value })}
                                                className="mt-1 block w-full bg-primary-text border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-white">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                value={editedVideo.description}
                                                onChange={(e) => setEditedVideo({ ...editedVideo, description: e.target.value })}
                                                rows="3"
                                                className="mt-1 block w-full bg-primary-text border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="url" className="block text-sm font-medium text-white">
                                                URL
                                            </label>
                                            <input
                                                type="text"
                                                id="url"
                                                value={editedVideo.url}
                                                onChange={(e) => setEditedVideo({ ...editedVideo, url: e.target.value })}
                                                className="mt-1 block w-full bg-primary-text border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="thumbnail" className="block text-sm font-medium text-white">
                                                Thumbnail
                                            </label>
                                            <input
                                                type="text"
                                                id="thumbnail"
                                                value={editedVideo.thumbnailUrl}
                                                onChange={(e) => setEditedVideo({ ...editedVideo, thumbnailUrl: e.target.value })}
                                                className="mt-1 block w-full bg-primary-text border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-white">
                                                Category
                                            </label>
                                            <select
                                                id="category"
                                                value={editedVideo.categoryId}
                                                onChange={(e) => setEditedVideo({ ...editedVideo, categoryId: Number(e.target.value) })}
                                                className="mt-1 block w-full bg-pm-gray border border-gray rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pm-purple-hover focus:border-pm-purple-hover"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingVideo(null)}
                                                className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-pm-purple-hover transition-colors cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-pm-purple text-white rounded-md hover:bg-pm-purple-hover transition-colors cursor-pointer"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VideoList
