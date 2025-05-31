import React, { useEffect, useState } from 'react';

const LoadingBar = ({ isLoading, progress = 0 }) => {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setWidth(0);
      
      // Simulate loading progress
      const timer = setTimeout(() => {
        setWidth(30);
      }, 50);

      const progressTimer = setTimeout(() => {
        setWidth(70);
      }, 200);

      return () => {
        clearTimeout(timer);
        clearTimeout(progressTimer);
      };
    } else {
      // Complete the loading bar
      setWidth(100);
      
      // Hide after animation completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setWidth(0);
      }, 300);

      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  // Use custom progress if provided
  useEffect(() => {
    if (progress > 0 && progress <= 100) {
      setWidth(progress);
    }
  }, [progress]);

  if (!isVisible && !isLoading) return null;

  return (
    <>
      <style>
        {`
          @keyframes loadingBarShine {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }
          .loading-bar-shine {
            animation: loadingBarShine 1.5s infinite;
          }
        `}
      </style>
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div 
          className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg transition-all duration-300 ease-out relative overflow-hidden"
          style={{
            width: `${width}%`,
            boxShadow: width > 0 ? '0 0 10px rgba(239, 68, 68, 0.7), 0 0 20px rgba(239, 68, 68, 0.4)' : 'none'
          }}
        >
          {/* Animated shine effect */}
          {width > 0 && width < 100 && (
            <div 
              className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 loading-bar-shine"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LoadingBar;
