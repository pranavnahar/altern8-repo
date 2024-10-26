import { fetchWithAuth } from '../../utilities/fetch-with-auth';
import { useState, useEffect } from 'react';

export const useGetGstList = () => {
  const [gstList, setGstList] = useState([]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('/user-api/gst-list/');
        const data = await response?.json();
        setMessage(data.message);
        setGstList(data.data);
      } catch (e) {
        setError(e);
      }
    };

    fetchData();
  }, []);

  return { gstList, message, error };
};
