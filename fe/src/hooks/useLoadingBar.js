import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useLoadingBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);

  // Start loading when location changes
  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    // Start loading
    setIsLoading(true);
    setProgress(0);

    // Simulate progressive loading
    let currentProgress = 0;
    progressRef.current = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress > 90) {
        currentProgress = 90;
        clearInterval(progressRef.current);
      }
      setProgress(currentProgress);
    }, 100);

    // Complete loading after a short delay to simulate route loading
    timeoutRef.current = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300 + Math.random() * 200); // Random delay between 300-500ms

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [location.pathname, location.search]);

  // Manual loading control
  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const updateProgress = (newProgress) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  return {
    isLoading,
    progress,
    startLoading,
    updateProgress,
    finishLoading
  };
};
