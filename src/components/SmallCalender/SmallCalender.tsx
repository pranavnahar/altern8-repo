'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Loading from '../Loading';
import 'react-calendar/dist/Calendar.css';
import styles from './SmallCalendar.module.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCalendarEvents } from '../../app/(dashboard)/calendar/actions';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Project {
  project_id: number;
  project_name: string;
  start_date: string;
  end_date: string;
  budget: number;
}

const SmallCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const result = await getCalendarEvents();
      if (result.error) {
        console.error("Error fetching projects:", result.error);
      } else {
        setProjects(result.projects);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    handleDateChange(new Date());
  }, [projects]);

  const handleDateChange = (value: Value) => {
    if (!value) return;

    const date = Array.isArray(value) ? value[0] : value;
    if (date instanceof Date) {
      setSelectedDate(date);

      const projectsOnSelectedDate = projects.filter(project =>
        isDateInRange(date, new Date(project.start_date), new Date(project.end_date))
      );
      setSelectedProjects(projectsOnSelectedDate);
      if (projectsOnSelectedDate.length > 0) {
        setDialogOpen(true);
      }
    }
  };

  const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
    return date >= start && date <= end;
  };

  const isProjectOnDate = (date: Date): boolean => {
    return projects.some(project =>
      isDateInRange(date, new Date(project.start_date), new Date(project.end_date))
    );
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && isProjectOnDate(date)) {
      return <div className={styles.eventIndicator}></div>;
    }
    return null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mb-20 bg-transparent">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={tileContent}
        className={`w-full max-w-md mx-auto ${styles.react_calendar} rounded-md`}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] max-w-3xl">
          <DialogHeader>
            <DialogTitle className='text-2xl text-white'>Projects on {selectedDate.toDateString()}</DialogTitle>
            <DialogDescription className='text-zinc-300 text-sm'>
              Here are the projects active on the selected date:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className='text-right'>Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProjects.map(project => (
                  <TableRow key={project.project_id}>
                    <TableCell className='text-zinc-300 text-sm'>{project.project_name}</TableCell>
                    <TableCell className='text-zinc-300 text-sm'>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                    <TableCell className='text-zinc-300 text-sm'>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                    <TableCell className='text-zinc-300 text-sm text-right'>${project.budget.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmallCalendar;
