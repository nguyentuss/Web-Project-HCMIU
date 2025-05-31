import { useNavigate } from 'react-router-dom';
import { useLoadingBarContext } from '../contexts/LoadingBarContext';

export const useNavigateWithLoading = () => {
  const navigate = useNavigate();
  const { startLoading, finishLoading } = useLoadingBarContext();

  const navigateWithLoading = (to, options = {}) => {
    // Start loading bar
    startLoading();
    
    // Small delay to show loading bar before navigation
    setTimeout(() => {
      navigate(to, options);
    }, 50);
  };

  return navigateWithLoading;
};
