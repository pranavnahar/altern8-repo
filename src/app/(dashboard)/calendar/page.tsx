'use client';

import React, { FC, useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventClickArg, EventApi } from '@fullcalendar/core';
import { getCalendarEvents } from './actions';
import EventModal from './components/event-modal';
import { Project } from './types';

const CalendarPage: FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent(info.event);
    setModalOpen(true);
  };
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      const result = await getCalendarEvents();
      if (result.error) {
        console.error('Error fetching events:', result.error);
      } else {
        setProjects(result.projects);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  //the below code is not a good solution, but works
  //but this bug was not from our side the FullCalendar has this an existing issue on their own repo
  const calendarRef = useRef<FullCalendar | null>(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();

    const resizeObserver = new ResizeObserver(() => {
      calendarApi?.updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const events = projects.map(project => ({
    id: project.project_id.toString(),
    title: project.project_name,
    start: project.start_date,
    end: project.end_date,
    extendedProps: {
      budget: project.budget,
    },
  }));

  // if (loading) {
  // return <LoadingOverlay />;
  // }

  return (
    <div className="min-h-screen pt-10 pb-10 text-xl font-semibold text-center text-white-font">
      <div
        ref={containerRef}
        className="flex flex-col justify-center max-w-[80%] mx-auto text-gray-300 "
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          eventClick={handleEventClick}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: '',
          }}
          height={'80vh'}
          weekends={true}
          events={events}
          buttonText={{ today: 'Today' }}
        />
        {modalOpen && selectedEvent && (
          <EventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} projects={projects} />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
