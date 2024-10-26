'use client';
import ActionItems from '../../../components/dashboard/Action-items';
import ChartCalender from '../../../components/dashboard/Chart-and-Calender';
import React, { useState, useEffect } from 'react';
import UpcomingProjects from '../../../components/dashboard/Upcoming-Projects/UpcomingProjects';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/utilities/auth';

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
            latePayments="test"
            showActionItems="test"
            upcomingPayments="test"
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
