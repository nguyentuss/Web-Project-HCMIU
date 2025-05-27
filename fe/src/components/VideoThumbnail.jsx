import React from 'react';
import { Link } from "react-router-dom";
import OptimizedImage from './OptimizedImage';

const VideoThumbnail = ({videoId, title, description, url, thumbnailUrl}) => {
    return (
        <div className="min-w-96 cursor-pointer aspect-[16/9]">
            <a href={`/watch/${videoId}`} className="relative">
                <OptimizedImage
                    src={`./assets/${thumbnailUrl}`}
                    alt="YouTube Video Thumbnail"
                    className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-full object-cover"
                />

                {/* Black Overlay on Hover */}
                <div className="absolute inset-0 px-5 py-3 bg-black text-white opacity-0 hover:opacity-80 transition-opacity">
                    <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h2>
                    <p className="text-xl line-clamp-2 lg:line-clamp-3">{description}</p>
                </div>
            </a>
        </div>
    )
}

export default VideoThumbnail
