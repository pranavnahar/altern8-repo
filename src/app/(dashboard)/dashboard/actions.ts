'use server';

import ky from 'ky';
import { notFound, redirect } from 'next/navigation';
import { ProjectResponse } from '../projects/types';
import { getAuthToken } from '@/utils/auth-actions';

export async function getSanctionedLimit(): Promise<number> {
  try {
    let token = await getAuthToken();

    const fetchLimit = async (token: string) => {
      const response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/check-limit/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        return responseData.limit;
      }

      if (response.status === 401) {
        redirect('/login');
      }
    };

    let limit = await fetchLimit(token!)
    return limit
  } catch (error) {
    redirect('/login');
  }
}

export async function fetchProjectData(timeoutMs: number = 60000): Promise<ProjectResponse> {
  try {
    const token = await getAuthToken();

    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      redirect('/login');
    }
    return (await response.json()) as ProjectResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        redirect('/login');
      }
      if (error.name === 'TimeoutError') {
        redirect('/login');
      }
      if (error.name === 'HTTPError' && error.message.includes('404')) {
        notFound();
      }
    }
    throw error;
  }
}

export async function postForFunding(projectIds: string[], timeoutMs: number = 60000) {
  try {
    const userData = {
      action: 'select',
      project_ids: projectIds,
    };
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.SERVER_URL}/rablet-api/project-selections/actions/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      },
    );
    const data = await response.json();
    if (!response.ok) {
      return {};
    }
    return {};
  } catch (error) {}
}
