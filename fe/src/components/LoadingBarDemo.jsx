import React from 'react';
import { useNavigateWithLoading } from '../hooks/useNavigateWithLoading';
import { useLoadingBarContext } from '../contexts/LoadingBarContext';

const LoadingBarDemo = () => {
    const navigateWithLoading = useNavigateWithLoading();
    const { startLoading, finishLoading, updateProgress, isLoading } = useLoadingBarContext();

    const handleNavigation = (path) => {
        navigateWithLoading(path);
    };

    const handleManualLoading = () => {
        startLoading();
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 10;
            updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                finishLoading();
            }
        }, 200);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-4">Loading Bar Demo</h3>
            <p className="mb-4 text-gray-300">
                Click any button to see the YouTube-style loading bar in action!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => handleNavigation('/')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                    Navigate to Home
                </button>
                
                <button
                    onClick={() => handleNavigation('/search')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                >
                    Navigate to Search
                </button>
                
                <button
                    onClick={() => handleNavigation('/profile')}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
                >
                    Navigate to Profile
                </button>
                
                <button
                    onClick={handleManualLoading}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded transition-colors ${
                        isLoading 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    Manual Loading Demo
                </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
                <p>• The loading bar automatically appears on route changes</p>
                <p>• It shows progress with smooth animations</p>
                <p>• Includes a YouTube-style shine effect</p>
                <p>• Can be controlled manually for custom loading states</p>
            </div>
        </div>
    );
};

export default LoadingBarDemo;
