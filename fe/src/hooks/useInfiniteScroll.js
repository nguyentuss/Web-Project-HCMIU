import { useState, useEffect, useCallback } from 'react';

const useInfiniteScroll = (fetchData, hasMore, pageSize = 10) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await fetchData(page, pageSize);
            setPage(prev => prev + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [fetchData, loading, hasMore, page, pageSize]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                === document.documentElement.offsetHeight
            ) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    return { loading, error, page };
};

export default useInfiniteScroll; 