"use server"

import { getAuthToken } from '@/utils/auth-actions';
import ky from 'ky';
import { notFound, redirect } from 'next/navigation';

export async function fetchTranchData(projectID: number, timeoutMs: number = 60000) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/${projectID}/tranches/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });



    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        redirect('/login')
      }
      if (error.name === 'TimeoutError') {
        redirect('/login')
      }
      if (error.name === 'HTTPError' && error.message.includes('404')) {
        notFound();
      }
    }
    throw error;
  }
}
