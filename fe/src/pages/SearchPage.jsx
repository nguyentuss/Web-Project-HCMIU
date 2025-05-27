import React from 'react';

import { useVideoStore } from '../stores/useVideoStore';

import VideoThumbnail from '../components/VideoThumbnail';
import OptimizedImage from '../components/OptimizedImage';

const SearchPage = () => {
    const { searchResults } = useVideoStore();

    return (
        <div className="relative min-h-screen">
            {/* Background image with overlay */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                <OptimizedImage
                    src="/assets/background.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            {/* Search Results */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-6 leading-[1.1]">
                        Search Results ({searchResults.length})
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map(video => (
                        <VideoThumbnail 
                            key={video.id} 
                            videoId={video.id} 
                            title={video.title} 
                            description={video.description} 
                            url={video.url} 
                            thumbnailUrl={video.thumbnailUrl} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
