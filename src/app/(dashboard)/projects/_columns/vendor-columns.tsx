import { ColumnDef } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
interface Vendor {
  vendor_id: number;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  id?: number
}

export const vendorColumns = (handleEdit: (id: number) => void) => {
  const data: ColumnDef<Vendor>[] = [
    {
      header: "Vendor ID",
      accessorKey: "vendor_id",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Contact Number",
      accessorKey: "contact_number",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      header: "Address",
      accessorKey: "address",
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
    }
  ];
  return data
} 
