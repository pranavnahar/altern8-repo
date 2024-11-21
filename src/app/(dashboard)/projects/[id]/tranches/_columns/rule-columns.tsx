"use client";

import { ColumnDef } from "@tanstack/react-table";
import TrancheRuleSheet from "../_components/tranche-rule-sheet";
import { Rule } from "../types";

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

export const rulesColumns: ColumnDef<Rule>[] = [
  {
    header: "Project",
    accessorKey: "project",
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    header: "Tranche",
    accessorKey: "tranche",
    enableHiding: true,
    cell: ({ getValue }) => getValue() ?? "-",
  },
  {
    accessorKey: "rule_type",
    header: "Rule Type",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description || "N/A",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      return row.original.is_active ? (
        <span className="text-green-500 font-medium">Active</span>
      ) : (
        <span className="text-red-500 font-medium">Inactive</span>
      );
    },
  },
  {
    accessorKey: "input_value",
    header: "Threshold",
    cell: ({ row }) => row.original.input_value?.threshold || "N/A",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = getValue();
      return date && typeof date === "string" ? formatDate(date) : "-";
    },
  },
  {
    accessorKey: "Actions",
    header: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <TrancheRuleSheet
          projectId={rowData.project}
          trancheId={rowData.tranche}
          mode="edit"
          initialData={{
            id: rowData.id,
            project: rowData.project,
            tranche: rowData.tranche,
            rule_type: rowData.rule_type,
            description: rowData.description,
            is_active: rowData.is_active,
            input_value: {
              threshold: rowData.input_value.threshold,
            },
          }}
        />
      );
    },
  },
];
