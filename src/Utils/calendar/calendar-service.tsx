import { getAccessToken } from '../../Utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    uid: string;
    invoice_amount: number;
    date: string;
  };
}

export const fetchEvents = async (accessToken: string): Promise<Event[]> => {
  try {
    let response = await fetch(`${API_URL}/admin-api/calendar/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      const newToken = await getAccessToken();
      if (newToken) {
        response = await fetch(`${API_URL}/admin-api/calendar/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      } else {
        throw new Error('Unable to refresh token');
      }
    }

    if (response.ok) {
      const data: Event[] = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch events');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
