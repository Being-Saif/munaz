import { useState, useEffect } from 'react';
import api from '@services/api';

/**
 * Fetches data from the live API.
 *
 * - While loading, `data` is `fallback` (optional) so the UI has something to render.
 * - On success, `data` is ALWAYS replaced with the API's response — including an
 *   empty array — so the site reflects real database state (no silent dummy fallback).
 * - On error (network/API failure), `data` stays as `fallback` so the UI doesn't crash.
 */
const useApi = (endpoint, fallback = []) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await api.get(endpoint);
        if (!cancelled) {
          const apiData = res.data ?? res;
          // Trust the API response as-is, even when it's an empty array/null —
          // that's the real state of the database.
          setData(apiData ?? (Array.isArray(fallback) ? [] : null));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          // Only here do we keep the fallback — the request itself failed.
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { data, loading, error };
};

export default useApi;
