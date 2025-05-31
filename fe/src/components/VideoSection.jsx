import React, { useEffect, useState } from 'react'

import { useVideoStore } from "../stores/useVideoStore";

import VideoThumbnail from './VideoThumbnail';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const VideoSection = ({cid, name}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Fetch & Filter Videos
    const { videos, fetchAllVideos, loading } = useVideoStore();

    useEffect(() => {
        fetchAllVideos();
    }, [fetchAllVideos]);

    const filteredVideos = videos.filter(video => String(video.categoryId) === String(cid));
    
    // Show 2 videos at a time with circular behavior
    const videosPerPage = 2;
    
    const handleNavigation = (newIndex) => {
        if (isTransitioning) return; // Prevent rapid clicks during transition
        
        setIsTransitioning(true);
        
        // Delay the index change for smoother out-in transition
        setTimeout(() => {
            setCurrentIndex(newIndex);
        }, 150);
        
        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };
    
    const goToPrevious = () => {
        const newIndex = currentIndex === 0 ? filteredVideos.length - 1 : currentIndex - 1;
        handleNavigation(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentIndex + 1) % filteredVideos.length;
        handleNavigation(newIndex);
    };

    // Get current videos to display with circular behavior
    const getCurrentVideos = () => {
        if (filteredVideos.length === 0) return [];
        if (filteredVideos.length === 1) return [filteredVideos[0], filteredVideos[0]];
        
        const videos = [];
        for (let i = 0; i < videosPerPage; i++) {
            const index = (currentIndex + i) % filteredVideos.length;
            videos.push(filteredVideos[index]);
        }
        return videos;
    };

    const currentVideos = getCurrentVideos();

    // Get total number of possible starting positions (each video can be the first)
    const totalPositions = filteredVideos.length;

    // Don't render if no videos
    if (filteredVideos.length === 0) {
        return null;
    }    return (
        <div className="bg-black py-12 pt-16" data-video-section>
            <h2 className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-3xl font-bold text-white mb-4">
                {name}
            </h2>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{/* Left Navigation Button */}
                {filteredVideos.length > 1 && (
                    <button
                        onClick={goToPrevious}
                        disabled={isTransitioning}
                        className={`absolute top-1/2 -translate-y-1/2 left-2 z-20 p-3 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-white/10 ${
                            isTransitioning 
                                ? 'opacity-30 cursor-not-allowed scale-95' 
                                : 'opacity-90 hover:opacity-100 hover:scale-110 hover:shadow-lg hover:shadow-black/30'
                        }`}
                    >
                        <ChevronLeftIcon className="text-white h-5 w-5" />
                    </button>
                )}

                {/* Video Display Area with smooth transitions */}
                <div className="overflow-hidden rounded-lg">
                    <div 
                        className={`grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] transition-all duration-500 ease-out transform ${
                            isTransitioning 
                                ? 'opacity-0 scale-95 blur-sm' 
                                : 'opacity-100 scale-100 blur-0'
                        }`}
                    >
                        {currentVideos.map((video, index) => (
                            <div 
                                key={`${video.id}-${currentIndex}-${index}`}
                                className={`transform transition-all duration-500 ease-out ${
                                    isTransitioning 
                                        ? 'translate-y-4 opacity-0 scale-95 rotate-1' 
                                        : 'translate-y-0 opacity-100 scale-100 rotate-0'
                                }`}
                                style={{ 
                                    transitionDelay: isTransitioning 
                                        ? `${index * 80}ms` 
                                        : `${(1 - index) * 120}ms`
                                }}
                            >
                                <VideoThumbnail 
                                    videoId={video.id} 
                                    title={video.title} 
                                    description={video.description} 
                                    url={video.url} 
                                    thumbnailUrl={video.thumbnailUrl} 
                                />
                            </div>
                        ))}
                        
                        {/* Fill empty slot if only 1 video total */}
                        {filteredVideos.length === 1 && (
                            <div className="hidden md:block"></div>
                        )}
                    </div>
                </div>

                {/* Right Navigation Button */}
                {filteredVideos.length > 1 && (
                    <button
                        onClick={goToNext}
                        disabled={isTransitioning}
                        className={`absolute top-1/2 -translate-y-1/2 right-2 z-20 p-3 bg-black/60 hover:bg-black/80 rounded-full transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-white/10 ${
                            isTransitioning 
                                ? 'opacity-30 cursor-not-allowed scale-95' 
                                : 'opacity-90 hover:opacity-100 hover:scale-110 hover:shadow-lg hover:shadow-black/30'
                        }`}
                    >
                        <ChevronRightIcon className="text-white h-5 w-5" />
                    </button>
                )}

                {/* Page Indicators - Show dots for each possible starting position */}
                {filteredVideos.length > 2 && (
                    <div className="flex justify-center mt-8 space-x-4">
                        {Array.from({ length: totalPositions }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handleNavigation(index)}
                                disabled={isTransitioning}
                                className={`relative w-4 h-4 rounded-full transition-all duration-400 ease-out cursor-pointer transform overflow-hidden ${
                                    currentIndex === index 
                                        ? 'bg-white scale-125 shadow-lg shadow-white/30' 
                                        : 'bg-gray-500/60 hover:bg-gray-300/80 hover:scale-110'
                                } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:shadow-md'}`}
                            >
                                {/* Active indicator glow effect */}
                                {currentIndex === index && (
                                    <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-30"></div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoSection