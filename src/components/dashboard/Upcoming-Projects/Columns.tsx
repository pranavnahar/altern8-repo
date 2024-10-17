import { formatIndianNumber } from '@/Utils/money';
import { Column } from './types';

const getColumns = (): Column[] => [
  {
    header: 'ID',
    accessorKey: 'id',
    nowrap: true,
    cell: info => <h1 className="font-medium tracking-wider text-white">{info.getValue()}</h1>,
  },
  {
    header: 'Name',
    accessorKey: 'project_name',
    nowrap: true,
    cell: info => <h1 className="font-medium tracking-wider text-white">{info.getValue()}</h1>,
  },
  {
    header: 'Location',
    accessorKey: 'location',
    nowrap: true,
    cell: info => <h1 className="font-medium tracking-wider text-white">{info.getValue()}</h1>,
  },
  {
    header: 'Total',
    accessorKey: 'project_total',
    nowrap: true,
    cell: info => (
      <h1 className="font-medium tracking-wider text-white">
        ₹ {formatIndianNumber(info.getValue())}
      </h1>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'approved_by_admin',
    nowrap: true,
    cell: info => (
      <h1 className="font-medium tracking-wider text-white">
        {info.getValue() ? `Approved` : `In Progress`}
      </h1>
    ),
  },
];

export default getColumns;

export const statusColors: Record<string, string> = {
  Register: '#fcca83',
  POC: '#fcca83',
  'Bank Details': '#fcca83',
  'Select PAN': '#fcca83',
  ITR: '#fcca83',
  PAN: '#fcca83',
  Entity: '#fcca83',
  'Bureau Report': '#fcca83',
  'Select GST': '#fcca83',
  GST: '#fcca83',
  'Select Invoice': '#fcca83',
  'Accounting Data': '#fcca83',
  Questions: '#fcca83',
  Ecommerce: '#fcca83',
  POS: '#fcca83',
  Youtube: '#fcca83',
  Udyam: '#fcca83',
  'Upload Contract': '#fcca83',
  'Pending for Maker': '#E74694',
  'Pending for Checker': '#E74694',
  Approved: '#16BDCA',
  Rejected: '#2D87BB',
};
