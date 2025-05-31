# YouTube-Style Loading Bar

A smooth, animated loading bar that appears at the top of the page during navigation, similar to YouTube's loading indicator.

## Features

- 🎯 **Automatic Route Detection** - Automatically shows during React Router navigation
- ⚡ **Smooth Animations** - Includes fade, scale, and shine effects
- 🎨 **YouTube-Style Design** - Red gradient with glow effects
- 🎛️ **Manual Control** - Programmatic control for custom loading states
- 📱 **Responsive** - Works across all device sizes
- 🔄 **Progress Tracking** - Simulated progress with realistic timing

## Quick Start

The loading bar is automatically integrated into your app through the `LoadingBarProvider` in `App.jsx`. No additional setup required!

## Usage

### Automatic Navigation Loading

The loading bar automatically appears when navigating between routes:

```jsx
import { Link } from 'react-router-dom';

// Regular Link components automatically trigger the loading bar
<Link to="/search">Go to Search</Link>
```

### Programmatic Navigation with Loading

Use the `useNavigateWithLoading` hook for programmatic navigation:

```jsx
import { useNavigateWithLoading } from '../hooks/useNavigateWithLoading';

function MyComponent() {
    const navigateWithLoading = useNavigateWithLoading();
    
    const handleClick = () => {
        navigateWithLoading('/profile');
    };
    
    return <button onClick={handleClick}>Go to Profile</button>;
}
```

### Manual Loading Control

For custom loading states (API calls, form submissions, etc.):

```jsx
import { useLoadingBarContext } from '../contexts/LoadingBarContext';

function MyComponent() {
    const { startLoading, updateProgress, finishLoading, isLoading } = useLoadingBarContext();
    
    const handleAsyncOperation = async () => {
        startLoading();
        
        try {
            updateProgress(25);
            await step1();
            
            updateProgress(50);
            await step2();
            
            updateProgress(75);
            await step3();
            
            updateProgress(100);
        } finally {
            finishLoading();
        }
    };
    
    return (
        <button onClick={handleAsyncOperation} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Start Process'}
        </button>
    );
}
```

## Components

### LoadingBar
The main visual component that renders the loading bar.

**Props:**
- `isLoading` (boolean) - Whether the loading bar should be visible
- `progress` (number, 0-100) - Current progress percentage

### LoadingBarProvider
Context provider that wraps your app and manages loading state.

### useLoadingBar
Hook that provides loading bar state and controls.

**Returns:**
- `isLoading` (boolean) - Current loading state
- `progress` (number) - Current progress (0-100)
- `startLoading()` - Start the loading animation
- `updateProgress(number)` - Update progress (0-100)
- `finishLoading()` - Complete and hide the loading bar

### useNavigateWithLoading
Hook for programmatic navigation with automatic loading bar.

**Returns:**
- `navigateWithLoading(path, options)` - Navigate with loading bar

### useLoadingBarContext
Hook to access the loading bar context in components.

## Styling

The loading bar uses Tailwind CSS classes and can be customized by modifying the `LoadingBar` component:

- **Colors**: Red gradient (`from-red-500 via-red-600 to-red-700`)
- **Height**: 1px (`h-1`)
- **Position**: Fixed at top (`fixed top-0`)
- **Z-index**: 50 (`z-50`)
- **Effects**: Glow shadow and shine animation

## Integration Examples

### Video Thumbnail Navigation
```jsx
// VideoThumbnail.jsx
const VideoThumbnail = ({ videoId }) => {
    const navigateWithLoading = useNavigateWithLoading();
    
    const handleClick = () => {
        navigateWithLoading(`/watch/${videoId}`);
    };
    
    return <div onClick={handleClick}>...</div>;
};
```

### Search Navigation
```jsx
// Navbar.jsx
const handleSearch = async (e) => {
    e.preventDefault();
    try {
        await fetchVideosBySearch(searchQuery);
        navigateWithLoading(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
        // Handle error
    }
};
```

### Form Submission with Progress
```jsx
const handleSubmit = async (formData) => {
    startLoading();
    
    try {
        updateProgress(20);
        await validateForm(formData);
        
        updateProgress(60);
        await submitToAPI(formData);
        
        updateProgress(100);
        navigateWithLoading('/success');
    } catch (error) {
        finishLoading();
        // Handle error
    }
};
```

## Technical Details

- Built with React hooks and context
- Integrates with React Router v6
- Uses CSS animations for smooth transitions
- Automatically detects route changes via `useLocation`
- Simulates realistic loading progress with random delays
- Includes cleanup for memory management

## Browser Support

Compatible with all modern browsers that support:
- CSS transforms and transitions
- ES6+ features
- React 18+
