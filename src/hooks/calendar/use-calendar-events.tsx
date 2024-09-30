/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchEvents } from '../../Utils/calendar/calendar-service';
import { useState, useEffect } from 'react';

// Define the structure of the event data returned by the fetchEvents function
interface EventData {
  id: string;
  title: string;
  start_time: string; // API returns date as string
  end_time: string;   // API returns date as string
  extendedProps: {
    uid: string;
    payments_data: number;
    invoice_date: string;
  };
}

// Define your local CalendarEvent interface to match the structure you need
interface CalendarEvent {
  id: string;
  title: string;
  start: Date; // Converted to Date
  end: Date;   // Converted to Date
  extendedProps: {
    uid: string;
    invoice_amount: number;
    date: string;
  };
}

// Function to map the data from EventData (API response) to CalendarEvent (local state)
const mapEventDataToEvent = (data: EventData[]): CalendarEvent[] => {
  return data.map(eventData => ({
    id: eventData.id,
    title: eventData.title,
    start: new Date(eventData.start_time), // Convert string to Date
    end: new Date(eventData.end_time),     // Convert string to Date
    extendedProps: {
      uid: eventData.extendedProps.uid,
      invoice_amount: eventData.extendedProps.payments_data, // Map payments_data to invoice_amount
      date: eventData.extendedProps.invoice_date,
    },
  }));
};

const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEvents = async () => {
      const accessToken = localStorage.getItem('accessToken'); // Get access token from local storage or another source
      if (!accessToken) {
        console.error("Access token is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // const data: EventData[] = await fetchEvents(accessToken); // Ensure fetchEvents returns EventData[]
        // const formattedEvents = mapEventDataToEvent(data); // Map EventData[] to CalendarEvent[]
        // setEvents(formattedEvents); // Update the state with formatted events
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      } finally {
        setLoading(false); // Ensure the loading state is set to false
      }
    };

    getEvents();
  }, []);

  return { events, loading };
};

export default useCalendarEvents;
