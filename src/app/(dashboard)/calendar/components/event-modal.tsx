import React from "react";
import { IconArrowBack, IconX } from "@tabler/icons-react";
import { Project } from "../types";
import EventTable from "./event-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";

type Props = {
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<Props> = ({ projects, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[50%] border-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <IconArrowBack onClick={onClose} className="text-[#d4d4d4] cursor-pointer" />
          <DialogTitle className="text-xl font-semibold text-gray-300">
            Projects and timelines
          </DialogTitle>
          <IconX onClick={onClose} className="text-[#d4d4d4] cursor-pointer" />
        </DialogHeader>
        <div className="relative flex-auto px-6 mb-5">
          {projects.map((project, index) => (
            <EventTable
              key={index}
              project_id={project.project_id}
              project_name={project.project_name}
              start_date={project.start_date}
              end_date={project.end_date}
              budget={project.budget}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
