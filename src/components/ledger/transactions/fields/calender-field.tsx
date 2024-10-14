import React from "react";
import { Calendar } from "../../../../components/ui/calendar";

const CalendarField: React.FC<{
  label: string;
  selected: Date | string;
  onSelect: (day: Date | undefined) => void;
}> = ({ label, selected, onSelect }) => {
  return (
    <div className="flex-1 w-full">
      <div className="h-6 mt-3 text-xs font-medium leading-8 text-gray-400 uppercase">
        {label}
      </div>
      <Calendar
        mode="single"
        selected={selected as Date}
        onSelect={onSelect}
        className="my-2 border text-white rounded-lg"
      />
    </div>
  );
};

export default CalendarField;
