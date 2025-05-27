import React, { useEffect } from 'react';

import { useVideoStore } from '../stores/useVideoStore'

import { StarIcon } from '@heroicons/react/24/solid';
import OptimizedImage from './OptimizedImage';

const Sidebar = () => {
    const { videos, fetchAllVideos, loading } = useVideoStore();

    useEffect(() => {
        fetchAllVideos();
    }, [fetchAllVideos]);

    return (
        <div className="lg:w-md bg-pm-gray text-white px-3 lg:pr-24 lg:py-6 overflow-y-auto">
            <ul>
                {videos.map((video) => (
                    <a key={video.id} href={`/watch/${video.id}`}>
                        <li key={video.id} className="flex space-x-3 p-2 hover:bg-se-gray cursor-pointer">
                            <OptimizedImage 
                                src={`../assets/${video.thumbnailUrl}`} 
                                alt={video.title} 
                                className="w-[168px] h-[94px] object-cover flex-shrink-0 rounded-lg" 
                            />
                            <div>
                                <span className="text-md font-semibold line-clamp-2">{video.title}</span>
                                <span className="text-sm text-gray-400">{video.viewCount} Views</span>
                                <div className="flex gap-2">
                                    <StarIcon className="w-3" />
                                    <span className="text-sm text-gray-400">{video.averageRating?.toFixed(1)}</span>
                                </div>
                            </div>
                        </li>
                    </a>
                ))}
            </ul>
      </div>
    )
}

export default Sidebar
