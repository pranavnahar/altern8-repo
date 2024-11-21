"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

interface BudgetItem {
  lots_count: number;
  lots_amount: number;
  foundation_starts_count: number;
  foundation_starts_amount: number;
  models_count: number;
  models_amount: number;
  started_completed_count: number;
  started_completed_amount: number;
  units_count: number;
  units_amount: number;
  contingent_sales_count: number;
  contingent_sales_amount: number;
  id?: number; // Assuming there's an optional ID for identifying rows
}

export const InventoryColumns = (handleEdit: (id: number) => void) => {
  const data: ColumnDef<BudgetItem>[] = [
    {
      header: "Lots Count",
      accessorKey: "lots_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Lots Amount",
      accessorKey: "lots_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Foundation Starts Count",
      accessorKey: "foundation_starts_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Foundation Starts Amount",
      accessorKey: "foundation_starts_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Models Count",
      accessorKey: "models_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Models Amount",
      accessorKey: "models_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Started/Completed Count",
      accessorKey: "started_completed_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Started/Completed Amount",
      accessorKey: "started_completed_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Units Count",
      accessorKey: "units_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Units Amount",
      accessorKey: "units_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Contingent Sales Count",
      accessorKey: "contingent_sales_count",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Contingent Sales Amount",
      accessorKey: "contingent_sales_amount",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Actions",
      accessorKey: "Actions",
      cell: ({ row }) => {
        const projectId = row.original.id;
        return (
          <Button
            size="lg"
            variant="default"
            className="w-full sm:w-auto mr-9 whitespace-nowrap text-xs"
            onClick={() => projectId && handleEdit(projectId)}
          >
            <span className="flex items-center justify-center gap-2">
              <Settings2 className="h-4 w-4" />
              <span>Edit</span>
            </span>
          </Button>
        );
      },
    },
  ];
  return data
};
