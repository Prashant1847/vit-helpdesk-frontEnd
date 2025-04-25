import { useState } from 'react';

const useManualFetch = (initialState = []) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (url, options = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(url, options);

      if (!res.ok) throw new Error();

      const json = await res.json();
      setData(json);

      return json //send the data so that based on this success message can be shown

    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useManualFetch;
