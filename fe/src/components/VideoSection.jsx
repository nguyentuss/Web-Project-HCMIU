import React, { useEffect, useRef } from 'react'

import { useVideoStore } from "../stores/useVideoStore";

import VideoThumbnail from './VideoThumbnail';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const VideoSection = ({cid, name}) => {
    const scrollRef = useRef(null);

    const scroll = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    // Fetch & Filter Videos
    const { videos, fetchAllVideos, loading } = useVideoStore();

    useEffect(() => {
        fetchAllVideos();
    }, [fetchAllVideos]);

    const filteredVideos = videos.filter(video => String(video.categoryId) === String(cid));

    return (
        <div className="bg-black py-8">
            <h2 className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-3xl font-bold text-white mb-4">
                {name}
            </h2>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => scroll(-400)}
                    className="absolute top-0 left-0 z-10 h-full px-2 cursor-pointer"
                >
                    <ChevronLeftIcon className="text-white h-10" />
                </button>

                <div ref={scrollRef} className="relative flex overflow-x-auto space-x-4 no-scrollbar scroll-smooth">
                    {filteredVideos.map(video => {
                        return (
                            <VideoThumbnail key={video.id} videoId={video.id} title={video.title} description={video.description} url={video.url} thumbnailUrl={video.thumbnailUrl} />
                        )
                    })}
                </div>

                <button
                    onClick={() => scroll(400)}
                    className="absolute top-0 right-0 z-10 h-full px-2 cursor-pointer"
                >
                    <ChevronRightIcon className="text-white h-10" />
                </button>
            </div>
        </div>
    )
}

export default VideoSection