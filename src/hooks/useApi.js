import { useState, useEffect } from 'react';
import api from '@services/api';

/**
 * Simple hook to fetch data from the API
 * Shows defaultData immediately, replaces with API data when loaded
 */
const useApi = (endpoint, defaultData = []) => {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await api.get(endpoint);
        if (!cancelled) {
          const apiData = res.data || res;
          // Only update if we actually got data
          if (apiData && (Array.isArray(apiData) ? apiData.length > 0 : true)) {
            setData(apiData);
          }
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          // Keep defaultData on error — don't clear it
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
