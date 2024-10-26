'use client';
import ActionItems from '../../../components/dashboard/Action-items';
import ChartCalender from '../../../components/dashboard/Chart-and-Calender';
import React, { useState, useEffect } from 'react';
import UpcomingProjects from '../../../components/dashboard/Upcoming-Projects/UpcomingProjects';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utils/auth';

const Page = () => {
  const router = useRouter();

  const [showTable, setShowTable] = useState<string>('');
  const [sanctionedLimit, setSanctionedLimit] = useState<number | null>(null);
  // console.log(showTable);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
    }
    return token;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        let accessToken = parseCookies().altern8_useraccess;

        if (!accessToken) {
          await ReplaceTokenOrRedirect();
        }

        // make api call to get the credit limit from backend
        let response = await fetch(`${apiUrl}/user-dashboard-api/check-limit/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // retry if 401 Unauthorized
        if (response.status === 401) {
          await ReplaceTokenOrRedirect();
          // try again
          response = await fetch(`${apiUrl}/user-dashboard-api/check-limit/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }

        if (response.ok) {
          const responseData = await response.json();
          setSanctionedLimit(responseData.limit);
          // console.log(responseData);
        }
      } catch (error) {
        console.error("An error occurred during the limit fetching:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex mt-8">
        <div className=" flex-[3] mx-16">
        <ActionItems
          latePayments={[
            { id: '1', amount: '$1000', dueDate: '2024-10-15', daysOverdue: 5 },
            { id: '2', amount: '$2000', dueDate: '2024-10-10', daysOverdue: 10 }
          ]}
          upcomingPayments={[
            { id: '3', amount: '$1500', dueDate: '2024-11-01', daysUntilDue: 7 },
            { id: '4', amount: '$23455', dueDate: '2024-11-05', daysUntilDue: 11 },
            { id: '11', amount: '$13500', dueDate: '2024-11-01', daysUntilDue: 6 },
            { id: '23', amount: '$33000', dueDate: '2024-11-05', daysUntilDue: 8 },
            { id: '33', amount: '$16500', dueDate: '2024-11-01', daysUntilDue: 2 },
            { id: '41', amount: '$355000', dueDate: '2024-11-05', daysUntilDue: 10 }
          ]}
          showActionItems={true}
          showActionItemsTables={setShowTable}
        />
          <UpcomingProjects />
        </div>
        <div className="flex-1">
          <ChartCalender sanctionedLimit={sanctionedLimit || 0} />
        </div>
      </div>
    </>
  );
};

export default Page;
