import React from 'react';
import { Link } from "react-router-dom";
import { useNavigateWithLoading } from '../hooks/useNavigateWithLoading';
import OptimizedImage from './OptimizedImage';

const VideoThumbnail = ({videoId, title, description, url, thumbnailUrl}) => {
    const navigateWithLoading = useNavigateWithLoading();

    const handleClick = (e) => {
        e.preventDefault();
        navigateWithLoading(`/watch/${videoId}`);
    };

    return (
        <div className="w-full cursor-pointer aspect-[16/9] group transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-black/20">
            <div onClick={handleClick} className="relative block h-full cursor-pointer">
                <OptimizedImage
                    src={`./assets/${thumbnailUrl}`}
                    alt="YouTube Video Thumbnail"
                    className="rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-500 ease-out w-full h-full object-cover group-hover:brightness-110"
                />

                {/* Black Overlay on Hover */}
                <div className="absolute inset-0 px-4 py-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out rounded-xl flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0">
                    <div className="transform transition-all duration-300 ease-out translate-y-4 group-hover:translate-y-0">
                        <h2 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 drop-shadow-lg">{title}</h2>
                        <p className="text-sm md:text-base line-clamp-2 lg:line-clamp-3 text-gray-200 drop-shadow-md">{description}</p>
                    </div>
                </div>                {/* Subtle border highlight on hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300 ease-out"></div>
            </div>
        </div>
    )
}

export default VideoThumbnail
