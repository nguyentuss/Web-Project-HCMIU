import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useUserStore } from '../stores/useUserStore';
import { useWatchListStore } from '../stores/useWatchListStore';
import OptimizedImage from '../components/OptimizedImage';
import toast from 'react-hot-toast';

const WatchListPage = () => {
    const navigate = useNavigate();
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

    return (
        <div className="bg-black min-h-screen text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-2xl font-bold mb-5">Your Watch List</h1>
                {watchList.length === 0 ? (
                    <p className="text-gray-400">Your watch list is empty</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {watchList.map((item) => (
                            <div key={item.id} className="flex items-center justify-between px-5 py-2 rounded-lg bg-se-gray hover:bg-pm-purple-hover transition-colors">
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
                                        <span className="text-xl font-semibold line-clamp-1">{item.title}</span>
                                        <span className="flex items-center gap-2 text-sm text-gray-400">
                                            <StarIcon className="w-3" />
                                            {item.averageRating}
                                        </span>
                                        <span className="text-sm text-gray-400">{item.viewCount} views</span>
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => handleRemoveFromWatchList(item.id)}
                                        className="p-2 hover:bg-red-400 rounded-full transition-colors cursor-pointer"
                                    >
                                        <TrashIcon className="w-5" />
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
