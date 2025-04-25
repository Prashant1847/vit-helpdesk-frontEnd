import { useState, useEffect } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(url, { ...options });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch data');
        }

        const json = await res.json();

        setData(json);
        setError('');

      } catch (err) {
          setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [url]);

  return { data, loading, error };
};

export default useFetch;
