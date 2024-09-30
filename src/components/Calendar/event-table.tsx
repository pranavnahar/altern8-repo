import React from 'react';
import Link from 'next/link';

interface EventProps {
  id: string;
  title: string;
  extendedProps: {
    uid: string;
    invoice_amount: number;
    date: string;
  };
}

interface EventTableProps {
  event: EventProps;
}

const EventTable: React.FC<EventTableProps> = ({ event }) => {
  return (
    <div className="col-span-4 pb-10 mt-3 mr-5 rounded-lg">
      <div className="rounded-lg">
        <table className="w-full overflow-hidden rounded-lg">
          <thead className="overflow-hidden border-b-2 border-gray-400 rounded-lg">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                Seller ID
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                Invoice ID
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                Title
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                Amount
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-200">
                Payment Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-sm font-medium text-blue-600">
                <Link href={`/sellers/${event.extendedProps.uid}`}>
                  {event.extendedProps.uid}
                </Link>
              </td>
              <td className="p-3 text-sm font-medium text-blue-600">
                <Link href={`/invoices/${event.id}`}>{event.id}</Link>
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                {event.title}
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                ₹ {event.extendedProps.invoice_amount?.toLocaleString('en-IN')}
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                {event.extendedProps.date}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
