import React, { FC } from 'react';
import { Project } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

const EventTable: FC<Project> = ({ project_id, project_name, start_date, end_date, budget }) => {
  return (
    <div className="col-span-4 pb-10 mt-3 mr-5 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-200">ID</TableHead>
            <TableHead className="text-gray-200">Name</TableHead>
            <TableHead className="text-gray-200">Start</TableHead>
            <TableHead className="text-gray-200">End</TableHead>
            <TableHead className="text-gray-200">Budget</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-gray-300">{project_id}</TableCell>
            <TableCell className="text-gray-300">{project_name}</TableCell>
            <TableCell className="text-gray-300">{start_date}</TableCell>
            <TableCell className="text-gray-300">{end_date}</TableCell>
            <TableCell className="text-gray-300">{budget}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default EventTable;
