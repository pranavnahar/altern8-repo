import { Calendar } from "@/components/ui/calendar";
import React from "react";

interface CalendarFieldProps {
  label: string;
  selected: Date | null;
  onSelect: (day: Date | undefined) => void;
}

const CalendarField: React.FC<CalendarFieldProps> = ({ label, selected, onSelect }) => {
  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <Calendar
        mode="single"
        selected={selected || undefined}
        onSelect={onSelect}
        className="rounded-md border"
      />
    </div>
  );
};

export default CalendarField;
