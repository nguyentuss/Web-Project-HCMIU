import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage video volume settings
 * @param {number} defaultVolume - Default volume level (0.0 to 1.0)
 * @returns {Object} - Returns videoRef and volume control functions
 */
export const useVideoVolume = (defaultVolume = 0.5) => {
    const videoRef = useRef(null);

    // Set the default volume when video loads
    const setDefaultVolume = () => {
        if (videoRef.current) {
            videoRef.current.volume = defaultVolume;
        }
    };

    // Set volume to a specific level
    const setVolume = (level) => {
        if (videoRef.current && level >= 0 && level <= 1) {
            videoRef.current.volume = level;
        }
    };

    // Mute/unmute video
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    };

    // Get current volume level
    const getCurrentVolume = () => {
        return videoRef.current ? videoRef.current.volume : defaultVolume;
    };

    return {
        videoRef,
        setDefaultVolume,
        setVolume,
        toggleMute,
        getCurrentVolume,
        defaultVolume
    };
};

export default useVideoVolume;
