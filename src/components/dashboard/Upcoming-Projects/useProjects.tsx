import { fetchWithAuth } from '../../../utilities/fetch-with-auth';
import { useState, useEffect } from 'react';
import { Projects } from './types';
import { DataRow } from '../types';

export const useProjects = () => {
  const [projectList, setprojectList] = useState<DataRow[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('/rablet-api/projects/');
        const data = await response?.json();
        setprojectList(data.results);
      } catch (e) {
        setError(e);
      }
    };
    fetchData();
  }, []);

  return { projectList, error };
};
