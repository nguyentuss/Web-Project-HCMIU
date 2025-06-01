import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/useUserStore';
import { useWatchListStore } from '../stores/useWatchListStore';
import { useNavigateWithLoading } from '../hooks/useNavigateWithLoading';
import OptimizedImage from '../components/OptimizedImage';
import toast from 'react-hot-toast';

const WatchListPage = () => {
    const navigate = useNavigate();
    const navigateWithLoading = useNavigateWithLoading();
    const { user } = useUserStore();
    const { watchList, loading, error, fetchWatchList, removeFromWatchList } = useWatchListStore();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWatchList(user.id);
    }, [user, fetchWatchList, navigate]);

    const handleRemoveFromWatchList = async (videoId) => {
        try {
            await removeFromWatchList(videoId);
            toast.success('Removed from watch list');
        } catch (error) {
            toast.error('Failed to remove from watch list');
        }
    };

    if (loading) {
        return (
            <div className="bg-black h-screen text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pm-purple"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-black h-screen text-white flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-2xl font-bold mb-5">Your Watch List</h1>
                {!watchList || watchList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-lg mb-4">Your watch list is empty</div>
                        <p className="text-gray-500 text-sm">Start adding videos to your watch list to see them here!</p>
                    </div>                ) : (
                    <div className="flex flex-col gap-3">
                        {watchList && watchList.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-5 py-3 rounded-lg bg-se-gray hover:bg-pm-purple-hover transition-all duration-300 ease-out group">
                                <div 
                                    className="flex gap-3 cursor-pointer flex-1 transform transition-all duration-200 group-hover:scale-[1.02]"                                    onClick={() => navigateWithLoading(`/watch/${item.id}`)}
                                >
                                    <OptimizedImage
                                        src={`../assets/${item.thumbnailUrl}`} 
                                        alt={item.title}                                        className="max-w-32 aspect-[16/9] object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300" 
                                    />
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xl font-semibold line-clamp-2 mb-2">{item.title}</span>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-2">
                                                <StarIcon className="w-3" />
                                                {item.averageRating ? Number(item.averageRating).toFixed(1) : 'N/A'}
                                            </span>
                                            <span>{item.viewCount} views</span>
                                        </div>                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button 
                                        onClick={() => handleRemoveFromWatchList(item.id)}
                                        className="p-2 hover:bg-red-500 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 cursor-pointer group/button"
                                        title="Remove from watch list"
                                    >
                                        <TrashIcon className="w-5 text-white group-hover/button:text-red-100 transition-colors duration-200" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchListPage;
