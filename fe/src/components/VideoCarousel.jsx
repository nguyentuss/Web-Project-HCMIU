import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";

import { BookmarkIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import OptimizedImage from './OptimizedImage';

const carouselVideos = [
    {
        id: 1,
        title: "Solo Leveling",
        description: "Enter the world of shadows and awaken your true power. Watch the latest episodes now.",
        tags: ["16+", "Entertainment"],
        carouselImg: "https://images5.alphacoders.com/137/1372162.jpeg"
    },
    {
        id: 2,
        title: "Chainsaw Man",
        description: "Denji harbors a chainsaw devil within him. The world is introduced to Chainsaw Man, but...?!",
        tags: ["16+", "Entertainment"],
        carouselImg: "https://images3.alphacoders.com/128/1283303.png"
    },
    {
        id: 3,
        title: "One Piece",
        description: "Join Monkey D. Luffy and his swashbuckling crew in their search for the ultimate treasure, the One Piece.",
        tags: ["14+", "Entertainment"],
        carouselImg: "https://4kwallpapers.com/images/wallpapers/one-piece-character-5120x2880-15328.jpeg"
    },
];

const VideoCarousel = () => {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);
  
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
  
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrent((prevIndex) =>
                prevIndex === carouselVideos.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000);
    
        return () => {
            resetTimeout();
        };
    }, [current]);

    return (
        <div className="w-full overflow-hidden relative aspect-[4/3] md:aspect-[16/9]">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)`, width: `${carouselVideos.length * 100}%` }}
            >
                {carouselVideos.map((video) => (
                <div key={video.id} className="h-screen flex items-center justify-center flex-shrink-0">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                        <OptimizedImage
                            src={video.carouselImg}
                            alt={`Slide ${video.id + 1}`}
                            loading="lazy"
                        />
                    </div>
                </div>
                ))}
            </div>

            {/* Left overlay with text */}
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10">
                <div className="h-full w-1/2 flex items-center px-10 md:px-44 text-white">
                    <div className="relative h-[200px] lg:h-[600px] w-full">
                        <div>
                            {carouselVideos.map((video, index) => (
                                <div key={index} className={`${current === index ? 'block' : 'hidden'}`}>
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                        {video.title}
                                    </h1>

                                    <ul className="flex gap-x-2 mb-3">
                                        {video.tags.map((tag) => (
                                            <li key={tag} className="w-fit px-3 py-1 bg-pm-purple font-semibold rounded-full">
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="hidden lg:block text-md md:text-lg text-gray-300 mb-6 max-w-md">
                                        {video.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Buttons and Indicators - Fixed at bottom */}
                        <div className="hidden md:block absolute top-40 lg:top-50 left-0 w-full">
                            <div className="flex items-center gap-x-2 mb-10">
                                <Link to="#" className="flex items-center gap-x-2 bg-pm-purple hover:bg-pm-purple-hover transition-colors text-white font-semibold px-6 py-3 rounded">
                                    <PlayIcon className="w-5" />
                                    Watch Now
                                </Link>

                                <button className="border-2 border-pm-purple hover:border-pm-purple-hover hover:bg-pm-purple-hover transition-colors text-pm-purple hover:text-white font-semibold px-6 py-3 rounded cursor-pointer">
                                    <BookmarkIcon className="w-5" />
                                </button>
                            </div>

                            {/* Line Indicators */}
                            <div className="flex space-x-2">
                                {carouselVideos.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-2 rounded-full ${
                                            current === index ? "bg-white" : "bg-gray-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom dark overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/100 to-transparent z-10 pointer-events-none" />
        </div>
    )
}

export default VideoCarousel
