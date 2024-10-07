import React from "react";
import EventTable from "./event-table";
import { IconButton } from "@mui/material";
import { IconChevronLeft, IconX } from "@tabler/icons-react";

interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  extendedProps: {
    uid: string;
    invoice_amount: number;
    date: string;
  };
}


interface EventModalProps {
  event: EventType;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 outline-none focus:outline-none">
      <div className="relative w-1/2 mx-auto my-6">
        <div className="relative flex flex-col rounded-lg shadow-lg outline-none focus:outline-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
          <div className="flex items-center justify-between p-5 rounded-t">
            <IconButton>
              <IconChevronLeft onClick={onClose} style={{ fill: "#d4d4d4" }} />
            </IconButton>

            <h3 className="text-xl font-semibold text-gray-300">
              Invoices & Payment Dates
            </h3>
            <IconButton>
              <IconX onClick={onClose} style={{ fill: "#d4d4d4" }} />
            </IconButton>
          </div>
          <div className="relative flex-auto px-6 mb-5">
            <EventTable
              event={{
                ...event,
                extendedProps: event.extendedProps || {
                  uid: "default-uid",
                  invoice_amount: 0,
                  date: new Date().toISOString(),
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
