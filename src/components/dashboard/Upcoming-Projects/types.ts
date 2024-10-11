export interface Projects {
  id: string;
  project_total: string;
  project_name: string;
  project_location: string;
  approved_by_admin: boolean;
}

export interface Column {
  header: string;
  accessorKey?: string;
  nowrap: boolean;
  cell?: (info: any) => JSX.Element | string;
}
