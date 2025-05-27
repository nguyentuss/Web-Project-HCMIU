import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setError(true);
    };

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 bg-transparent animate-pulse rounded-lg" />
            )}
            <img
                src={error ? '/assets/placeholder.png' : src}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage; 