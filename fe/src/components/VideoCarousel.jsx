import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";

import { BookmarkIcon } from '@heroicons/react/24/outline';
import { PlayIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import OptimizedImage from './OptimizedImage';

const carouselVideos = [
    {
        id: 1,
        title: "Solo Leveling",
        description: "Enter the world of shadows and awaken your true power. Watch the latest episodes now.",
        tags: ["16+", "Entertainment"],
        carouselImg: "https://images5.alphacoders.com/137/1372162.jpeg",
        trailerUrl: "videos/sololeveling.mp4"
    },
    {
        id: 2,
        title: "Chainsaw Man",
        description: "Denji harbors a chainsaw devil within him. The world is introduced to Chainsaw Man, but...?!",
        tags: ["16+", "Entertainment"],
        carouselImg: "https://images3.alphacoders.com/128/1283303.png",
        trailerUrl: "videos/csm.mp4"
    },
    {
        id: 3,
        title: "One Piece",
        description: "Join Monkey D. Luffy and his swashbuckling crew in their search for the ultimate treasure, the One Piece.",
        tags: ["14+", "Entertainment"],
        carouselImg: "https://4kwallpapers.com/images/wallpapers/one-piece-character-5120x2880-15328.jpeg",
        trailerUrl: "videos/one_piece.mp4"
    },
];

const VideoCarousel = () => {
    const [current, setCurrent] = useState(0);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerVideoIndex, setTrailerVideoIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef(null);
    const carouselRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);
    
    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };    const closeTrailer = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowTrailer(false);
            setIsClosing(false);
        }, 300); // Match the fade-out duration
    };    // Function to scroll to the next section (VideoSection)
    const scrollToNextSection = () => {
        const nextSection = document.querySelector('[data-video-section]');
        if (nextSection) {
            nextSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    // Function to scroll back to the VideoCarousel (top)
    const scrollToCarousel = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };    // Handle scroll detection for both directions
    const handleScroll = (event) => {
        const scrollThreshold = 50;
        
        // Use a ref to check current scrolling state to avoid stale closure
        if (!isScrolling) {
            const currentScrollY = window.scrollY;
            const carouselHeight = carouselRef.current?.offsetHeight || 0;
            
            if (event.deltaY > scrollThreshold) {
                // Scrolling down - go to next section (only when near bottom of carousel)
                if (currentScrollY < carouselHeight * 0.8) {
                    event.preventDefault();
                    setIsScrolling(true);
                    scrollToNextSection();
                    
                    // Reset scrolling state after navigation
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                        setIsScrolling(false);
                    }, 1000);
                }
            } else if (event.deltaY < -scrollThreshold) {
                // Scrolling up - go back to carousel (only when at the top boundary of VideoSection)
                // More precise boundary detection: only trigger when very close to the carousel bottom
                const boundaryZone = carouselHeight * 0.1; // 10% boundary zone
                if (currentScrollY > carouselHeight - boundaryZone && currentScrollY <= carouselHeight + boundaryZone) {
                    event.preventDefault();
                    setIsScrolling(true);
                    scrollToCarousel();
                    
                    // Reset scrolling state after navigation
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                        setIsScrolling(false);
                    }, 1000);
                }
            }
        }
    };

    // Preload images for smoother transitions
    useEffect(() => {
        carouselVideos.forEach(video => {
            const img = new Image();
            img.src = video.carouselImg;
        });
    }, []);
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrent((prevIndex) =>
                prevIndex === carouselVideos.length - 1 ? 0 : prevIndex + 1
            );
        }, 8000); // Auto-advance every 8 seconds
    
        return () => {
            resetTimeout();
        };
    }, [current]);    // Handle escape key to close modal and arrow keys for navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && showTrailer) {
                closeTrailer();
            } else if (!showTrailer && !isScrolling) {
                // Only handle navigation keys when modal is not open and not currently scrolling
                if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                    event.preventDefault();
                    setIsScrolling(true);
                    scrollToNextSection();
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                        setIsScrolling(false);
                    }, 1000);
                } else if (event.key === 'ArrowUp' || event.key === 'PageUp' || event.key === 'Home') {
                    event.preventDefault();
                    setIsScrolling(true);
                    scrollToCarousel();
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                    scrollTimeoutRef.current = setTimeout(() => {
                        setIsScrolling(false);
                    }, 1000);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showTrailer, isScrolling]);    // Add scroll listener for bidirectional navigation
    useEffect(() => {
        const handleWheelEvent = (event) => {
            handleScroll(event);
        };
        
        // Use document level listener for global scroll navigation
        document.addEventListener('wheel', handleWheelEvent, { passive: false });
        
        return () => {
            document.removeEventListener('wheel', handleWheelEvent);
        };
    }, []); // Remove isScrolling dependency to prevent re-mounting
    
    // Separate cleanup effect for scroll timeout
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);return (
        <div ref={carouselRef} className="w-full overflow-hidden relative aspect-[16/9] max-h-[1024vh]">
            {/* Render all slides stacked on top of each other */}
            {carouselVideos.map((video, index) => (
                <div 
                    key={video.id} 
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform-gpu ${
                        current === index 
                            ? 'opacity-100 scale-100 z-10' 
                            : 'opacity-0 scale-105 z-0'
                    }`}
                >
                    <div className="relative w-full h-full bg-gray-900">
                        <img
                            src={video.carouselImg}
                            alt={`Slide ${video.id + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-all duration-1000 ease-out transform-gpu"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                width: '100%',
                                height: '120%'
                            }}
                        />
                    </div>
                </div>
            ))}            {/* Left overlay with text */}
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black/90 via-black/40 to-transparent z-20">
                <div className="h-full flex items-center text-white">
                    <div className="relative h-[100px] lg:h-[600px] w-full max-w-2xl ml-8 sm:ml-12 md:ml-16 lg:ml-20 xl:ml-24 2xl:ml-32">
                        {/* Render all text content stacked */}
                        {carouselVideos.map((video, index) => (
                            <div 
                                key={index} 
                                className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                                    current === index 
                                        ? 'opacity-100 translate-y-0 scale-100' 
                                        : 'opacity-0 translate-y-8 scale-95'
                                }`}
                            >
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
                        ))}                        {/* Buttons and Indicators - Fixed at bottom */}
                        <div className="hidden md:block absolute top-40 lg:top-50 left-0 w-full">                            <div className="flex items-center gap-x-2 mb-10">
                                

                                <Link to="#" className="flex items-center gap-x-2 bg-pm-purple hover:bg-pm-purple-hover transition-all duration-300 ease-out text-white font-semibold px-6 py-3 rounded transform hover:scale-105">
                                    <PlayIcon className="w-5" />
                                    Watch Now
                                </Link>                                <button 
                                    onClick={() => {
                                        setTrailerVideoIndex(current);
                                        setShowTrailer(true);
                                    }}
                                    className="flex items-center gap-x-2 bg-transparent hover:bg-white/10 transition-all duration-300 ease-out text-white font-semibold px-6 py-3 rounded border border-white/30 hover:border-white/50 transform hover:scale-105"
                                >
                                    <PlayIcon className="w-5" />
                                    Watch Trailer
                                </button>

                                <button className="border-2 border-pm-purple hover:border-pm-purple-hover hover:bg-pm-purple-hover transition-all duration-300 ease-out text-pm-purple hover:text-white font-semibold px-6 py-3 rounded cursor-pointer transform hover:scale-105">
                                    <BookmarkIcon className="w-5" />
                                </button>
                            </div>

                            {/* Line Indicators */}
                            <div className="flex space-x-2">
                                {carouselVideos.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-8 h-2 rounded-full transition-all duration-500 ease-out transform cursor-pointer hover:scale-110 ${
                                            current === index ? "bg-white shadow-lg" : "bg-gray-400 hover:bg-gray-300"
                                        }`}
                                        onClick={() => {
                                            setCurrent(index);
                                            resetTimeout();
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>            {/* Bottom dark overlay */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/100 to-transparent z-10 pointer-events-none" />            {/* Navigation Button */}
            <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 lg:bottom-50 right-4 sm:right-6 md:right-8 z-30 flex flex-col items-center gap-2 sm:gap-3">                {/* Keyboard hint */}
                <div className="hidden lg:block text-center text-xs text-white/60 mb-2 font-medium">
                    Use ↑↓ or scroll wheel
                </div>

                {/* Scroll Down Button */}
                <button
                    onClick={scrollToNextSection}
                    className="group flex flex-col items-center gap-1 p-2 sm:p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg backdrop-blur-sm border border-white/20 hover:border-white/40 animate-bounce-gentle hover:animate-none"
                    title="Scroll to videos (↓ or Page Down)"
                >
                    <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white group-hover:text-pm-purple transition-colors duration-300" />
                    <span className="text-[10px] sm:text-xs text-white/80 group-hover:text-white transition-colors duration-300 font-medium">
                        Explore
                    </span>
                </button>
            </div>{/* Trailer Modal */}
            {showTrailer && (
                <div 
                    className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                        isClosing ? 'animate-fade-out' : 'animate-fade-in'
                    }`}
                    onClick={closeTrailer}
                >
                    <div 
                        className={`relative bg-black rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh] transition-all duration-400 ${
                            isClosing ? 'animate-scale-down' : 'animate-scale-up'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeTrailer}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>                        {/* Video iframe */}
                        <div className={`relative w-full transition-all duration-500 ${
                            isClosing ? 'animate-slide-down' : 'animate-slide-up'
                        }`} style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={carouselVideos[trailerVideoIndex].trailerUrl}
                                title={`${carouselVideos[trailerVideoIndex].title} Trailer`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Video title */}
                        <div className={`p-4 bg-gray-900 transition-all duration-500 ${
                            isClosing ? 'animate-slide-down-delayed' : 'animate-slide-up-delayed'
                        }`}>
                            <h3 className="text-white text-xl font-bold">
                                {carouselVideos[trailerVideoIndex].title} - Trailer
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoCarousel
