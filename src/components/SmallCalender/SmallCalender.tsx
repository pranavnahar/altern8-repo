/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Loading from '../Loading';
import 'react-calendar/dist/Calendar.css';
import styles from './SmallCalendar.module.css';

// Define the value types used by react-calendar
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const SmallCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
  const [events] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loadingSpinner] = useState<boolean>(false);

  useEffect(() => {
    handleDateChange(new Date()); // Pass a default event object
  }, [events]);

  // Updated handleDateChange to handle both Value and event from react-calendar
  const handleDateChange = (value: Value) => {
    if (!value) return; // Handle null case

    const date = Array.isArray(value) ? value[0] : value; // Get the first date if it's an array
    if (date instanceof Date) {
      setSelectedDate(date);

      const eventsOnSelectedDate = events.filter(
        event => new Date(event.date).toDateString() === date.toDateString(),
      );
      setSelectedEvents(eventsOnSelectedDate);
      if (eventsOnSelectedDate.length > 0) {
        setModalOpen(true);
      }
    }
  };

  const isEventOnDate = (date: Date): boolean => {
    return events.some(event => new Date(event.date).toDateString() === date.toDateString());
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isEventOnDate(date)) {
      return <div className={styles.eventIndicator}></div>;
    }
    return null;
  };

  // const handleTodayClick = () => {
  //   const today = new Date();
  //   setSelectedDate(today);
  //   handleDateChange(today, new MouseEvent("click")); // Pass a default event object
  // };

  if (loadingSpinner) {
    return <Loading />;
  }

  return (
    <div className="mb-20 bg-transparent">
      <Calendar
        // onChange={handleDateChange} // handle different possible values from react-calendar
        value={selectedDate}
        tileContent={tileContent}
        className={`w-full max-w-md mx-auto ${styles.react_calendar} custom-calendar rounded-md`}
      />
    </div>
  );
};

export default SmallCalendar;
