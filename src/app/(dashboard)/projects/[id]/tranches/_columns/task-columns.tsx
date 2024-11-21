"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tasks } from "../types";
import TrancheTaskSheet from "../_components/tranche-tasks-sheet";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options)
    .format(date)
    .replace(/(\d+)(st|nd|rd|th)/, "$1<sup>$2</sup>");
};

export const tasksColumns: ColumnDef<Tasks>[] = [
  {
    header: "Tranche",
    accessorKey: "tranche",
    enableHiding: true,
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: "Project",
    accessorKey: "project",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: "Owner",
    accessorKey: "owner_name",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: "Original Start Date",
    accessorKey: "original_start_date",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: "Original Completion Date",
    accessorKey: "original_completion_date",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: "Tranche Actual Start Date",
    accessorKey: "tranche_actual_start_date",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: "Tranche Actual Completion Date",
    accessorKey: "tranche_actual_completion_date",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    header: "Completion Date Variance",
    accessorKey: "completion_date_variance",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    accessorKey: "Actions",
    header: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <TrancheTaskSheet
          projectId={rowData.project}
          trancheId={rowData.tranche}
          mode="edit"
          initialData={{
            id: rowData.id,
            tranche: rowData.tranche,
            project: rowData.project,
            owner: rowData.owner,
            status: rowData.status,
            original_start_date: rowData.original_start_date,
            original_completion_date: rowData.original_completion_date,
          }}
        />
      );
    },
  },
];
