import React, { createContext, useContext } from 'react';
import { useLoadingBar } from '../hooks/useLoadingBar';
import LoadingBar from '../components/LoadingBar';

const LoadingBarContext = createContext();

export const LoadingBarProvider = ({ children }) => {
  const loadingBarState = useLoadingBar();

  return (
    <LoadingBarContext.Provider value={loadingBarState}>
      <LoadingBar 
        isLoading={loadingBarState.isLoading} 
        progress={loadingBarState.progress} 
      />
      {children}
    </LoadingBarContext.Provider>
  );
};

export const useLoadingBarContext = () => {
  const context = useContext(LoadingBarContext);
  if (!context) {
    throw new Error('useLoadingBarContext must be used within a LoadingBarProvider');
  }
  return context;
};
