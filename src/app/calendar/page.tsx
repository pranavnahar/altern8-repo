"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventClickArg, EventApi } from "@fullcalendar/core";
import EventModal from "../../components/Calendar/event-modal";
import useCalendarEvents from "../../hooks/calendar/use-calendar-events";

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
            event={{
              ...selectedEvent,
              start: selectedEvent.start || new Date(), // Fallback for start if it's null
              end: selectedEvent.end || new Date(),     // Fallback for end if it's null
              extendedProps: {
                uid: selectedEvent.extendedProps?.uid || 'default-uid',
                invoice_amount: selectedEvent.extendedProps?.invoice_amount || 0,
                date: selectedEvent.extendedProps?.date || new Date().toISOString(),
              }
            }}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
