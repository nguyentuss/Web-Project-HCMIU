import { useState, useEffect } from 'react';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useCache = (key, fetchData, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFromCache = async () => {
            try {
                // Check cache first
                const cachedData = localStorage.getItem(key);
                if (cachedData) {
                    const { data: cachedValue, timestamp } = JSON.parse(cachedData);
                    const isExpired = Date.now() - timestamp > CACHE_DURATION;

                    if (!isExpired) {
                        setData(cachedValue);
                        setLoading(false);
                        return;
                    }
                }

                // If no cache or expired, fetch new data
                const newData = await fetchData();
                setData(newData);

                // Update cache
                localStorage.setItem(key, JSON.stringify({
                    data: newData,
                    timestamp: Date.now()
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFromCache();
    }, [...dependencies, key]);

    const invalidateCache = () => {
        localStorage.removeItem(key);
    };

    return { data, loading, error, invalidateCache };
};

export default useCache; 