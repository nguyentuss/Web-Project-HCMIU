import React from 'react';
import VideoThumbnail from './VideoThumbnail';
import { StarIcon } from '@heroicons/react/24/solid';

const RelatedVideos = ({ videos, title = "Related Videos", maxVideos = 6 }) => {
    // Don't render if no videos
    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-white text-xl font-semibold">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.slice(0, maxVideos).map((video) => (
                    <div 
                        key={video.id} 
                        className="group transform transition-all duration-300 hover:scale-105"
                    >
                        <VideoThumbnail 
                            videoId={video.id} 
                            title={video.title} 
                            description={video.description} 
                            url={video.url} 
                            thumbnailUrl={video.thumbnailUrl} 
                        />
                        
                        {/* Video Info */}
                        <div className="mt-2 px-1">
                            <h3 className="text-white text-sm font-medium line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors">
                                {video.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{video.viewCount} views</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <StarIcon className="w-3 h-3 text-yellow-400" />
                                    <span>{video.averageRating?.toFixed(1) || 'N/A'}</span>
                                </div>
                                {video.categoryName && (
                                    <>
                                        <span>•</span>
                                        <span className="text-purple-400">{video.categoryName}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedVideos;
