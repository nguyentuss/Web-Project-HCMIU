import React from 'react';
import PropTypes from 'prop-types';

const SearchCard = ({ 
  suggestedMovies = [], 
  recentSearches = [], 
  onMovieClick,
  onRecentSearchClick 
}) => {
  return (
    <div className="w-full max-w-2xl bg-pm-gray text-white rounded-lg shadow-lg">
      {/* Recent Searches Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-pm-purple-hover rounded-lg cursor-pointer transition-colors"
              onClick={() => onRecentSearchClick(search)}
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="">{search}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchCard.propTypes = {
  suggestedMovies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
      poster: PropTypes.string.isRequired,
    })
  ),
  recentSearches: PropTypes.arrayOf(PropTypes.string),
  onMovieClick: PropTypes.func.isRequired,
  onRecentSearchClick: PropTypes.func.isRequired,
};

export default SearchCard; 