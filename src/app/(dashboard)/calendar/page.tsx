"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventClickArg, EventApi } from "@fullcalendar/core";
import useCalendarEvents from "./hooks/use-calendar-events";
import EventModal from "./components/event-modal";

const CalendarPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const { events, loading } = useCalendarEvents();

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent(info.event);
    setModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-10 pb-10 text-xl font-semibold text-center text-white-font">
      <div className="flex flex-col justify-center max-w-[90%] mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          eventClick={handleEventClick}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: '',
          }}
          height={'90vh'}
          weekends={true}
          events={events}
          buttonText={{ today: 'Today' }}
        />
        {modalOpen && selectedEvent && (
          <EventModal
            events={events}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
