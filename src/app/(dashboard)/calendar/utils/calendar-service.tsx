import { getAccessToken } from '../../../../utils/auth';
import { Project } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchEvents = async (accessToken: string): Promise<Project[]> => {
  try {
    let response = await fetch(`${API_URL}/user-dashboard-api/calendar/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newToken = await getAccessToken();
      if (newToken) {
        response = await fetch(`${API_URL}/user-dashboard-api/calendar/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      } else {
        throw new Error('Unable to refresh token');
      }
    }

    if (response.ok) {
      const data: Project[] = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
