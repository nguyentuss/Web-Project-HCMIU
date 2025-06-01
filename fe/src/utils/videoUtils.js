// Video utility functions for improved loading and caching

/**
 * Preload a video to improve loading performance
 * @param {string} videoUrl - The URL of the video to preload
 * @returns {Promise} - Promise that resolves when video is preloaded
 */
export const preloadVideo = (videoUrl) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true; // Required for autoplay policies
        
        const handleLoad = () => {
            console.log('Video preloaded:', videoUrl);
            resolve(video);
            cleanup();
        };
        
        const handleError = (error) => {
            console.error('Video preload failed:', videoUrl, error);
            reject(error);
            cleanup();
        };
        
        const cleanup = () => {
            video.removeEventListener('loadedmetadata', handleLoad);
            video.removeEventListener('error', handleError);
        };
        
        video.addEventListener('loadedmetadata', handleLoad);
        video.addEventListener('error', handleError);
        
        // Try multiple paths
        video.src = `/videos/${videoUrl}`;
        
        // Fallback after timeout
        setTimeout(() => {
            if (video.readyState < 1) {
                console.warn('Video preload timeout, trying fallback path');
                video.src = `./videos/${videoUrl}`;
            }
        }, 2000);
    });
};

/**
 * Check if a video file exists and is accessible
 * @param {string} videoUrl - The URL of the video to check
 * @returns {Promise<boolean>} - Promise that resolves to true if video exists
 */
export const checkVideoExists = async (videoUrl) => {
    const possiblePaths = [
        `/videos/${videoUrl}`,
        `./videos/${videoUrl}`,
        `../videos/${videoUrl}`
    ];
    
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            if (response.ok) {
                console.log('Video found at:', path);
                return { exists: true, path };
            }
        } catch (error) {
            console.warn('Failed to check video at path:', path);
        }
    }
    
    console.error('Video not found at any path for:', videoUrl);
    return { exists: false, path: null };
};

/**
 * Get optimal video source paths for better fallback handling
 * @param {string} videoUrl - The video filename
 * @returns {string[]} - Array of possible video paths
 */
export const getVideoSourcePaths = (videoUrl) => {
    return [
        `/videos/${videoUrl}`,
        `./videos/${videoUrl}`,
        `../videos/${videoUrl}`,
        `/public/videos/${videoUrl}`
    ];
};

/**
 * Format video duration from seconds to HH:MM:SS or MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatVideoDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Video quality detection and optimization
 * @param {HTMLVideoElement} videoElement - The video element
 * @returns {Object} - Video quality information
 */
export const getVideoQuality = (videoElement) => {
    if (!videoElement) return null;
    
    return {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        duration: videoElement.duration,
        buffered: videoElement.buffered.length > 0 ? videoElement.buffered.end(0) : 0,
        readyState: videoElement.readyState,
        networkState: videoElement.networkState
    };
};
