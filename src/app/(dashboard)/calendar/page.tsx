"use client"

import React, { FC, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventClickArg, EventApi } from "@fullcalendar/core";
import { getCalendarEvents } from "./actions";
import EventModal from "./components/event-modal";
import { Project } from "./types";

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
        console.error("Error fetching events:", result.error);
      } else {
        setProjects(result.projects);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  const events = projects.map(project => ({
    id: project.project_id.toString(),
    title: project.project_name,
    start: project.start_date,
    end: project.end_date,
    extendedProps: {
      budget: project.budget
    }
  }));

  // if (loading) {
  //   return <LoadingOverlay />;
  // }

  return (
    <div className="min-h-screen pt-10 pb-10 text-xl font-semibold text-center text-white-font">
      <div className="flex flex-col justify-center max-w-[90%] mx-auto text-gray-300">
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
          <EventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} projects={projects} />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
