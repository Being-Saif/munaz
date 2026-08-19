import { useState, useEffect } from 'react';
import api from '@services/api';

/**
 * Simple hook to fetch data from the API
 * Falls back to provided default data if API is unavailable
 */
const useApi = (endpoint, defaultData = []) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(endpoint);
        if (!cancelled) {
          setData(res.data || res);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          // Keep default data on error
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [endpoint]);

  return { data, loading, error };
};

export default useApi;
