'use server';

import ky from 'ky';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

async function getAuthToken() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('altern8_useraccess');
  if (!authCookie) {
    throw new Error('Not authenticated');
  }
  return authCookie.value;
}

export async function fetchProjectData(timeoutMs: number = 60000) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(`${process.env.NEXT_PUBLIC_API_URL}/rablet-api/projects/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        throw new Error('You are not authorized to access this resource. Please log in again.');
      }
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out');
      }
      if (error.name === 'HTTPError' && error.message.includes('404')) {
        notFound();
      }
    }
    throw error;
  }
}

export async function checkAuthentication() {
  try {
    await getAuthToken();
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false };
  }
}
