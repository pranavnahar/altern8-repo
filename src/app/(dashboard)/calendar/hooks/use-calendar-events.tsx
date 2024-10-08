import { useState, useEffect } from 'react';
import nookies from "nookies"
import { fetchEvents } from '../utils/calendar-service';
import { Project } from '../types';


const useCalendarEvents = () => {
  const [events, setEvents] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const cookies = nookies.get(null);
  const accessToken = cookies.altern8_useraccess;

  useEffect(() => {
    const getEvents = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data: Project[] = await fetchEvents(accessToken);
        console.log(data)
        setEvents(data);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  return { events, loading };
};

export default useCalendarEvents;
