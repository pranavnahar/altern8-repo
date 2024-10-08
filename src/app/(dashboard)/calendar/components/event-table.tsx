import React from 'react';
import Link from 'next/link';
import { Project } from '../types';

const EventTable: React.FC<Project> = ( project ) => {
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
                <Link href={`/sellers/${project.project_id}`}>
                  {project.project_id}
                </Link>
              </td>
              <td className="p-3 text-sm font-medium text-blue-600">
                <Link href={`/invoices/${project.project_id}`}>{project.project_id}</Link>
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                {project.project_name}
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                ₹ {project.budget?.toLocaleString('en-IN')}
              </td>
              <td className="p-3 text-sm font-medium text-gray-300 whitespace-nowrap hover:text-gray-200">
                {project.start_date}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
