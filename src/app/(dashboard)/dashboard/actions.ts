"use server"

import { getAccessToken, getAuthToken } from "@/utils/server-auth"
import ky from "ky"
import { notFound, redirect } from "next/navigation"
import { ProjectResponse } from "../projects/types"

export async function getSanctionedLimit(): Promise<number> {
  try {
    let accessToken = await getAuthToken()

    const fetchLimit = async (token: string) => {
      const response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/check-limit/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        return responseData.limit
      }

      if (response.status === 401) {
        redirect('/login')
      }
    }

    let limit = await fetchLimit(accessToken)

    if (limit === null) {
      const newToken = await getAccessToken()
      if (newToken === false) {
        redirect('/login')
      }
      limit = await fetchLimit(newToken)
      if (limit === null) {
        redirect('/login')
      }
    }

    return limit
  } catch (error) {
    redirect('/login')
  }
}

export async function fetchProjectData(timeoutMs: number = 60000): Promise<ProjectResponse> {
  try {
    const token = await getAuthToken();

    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    return await response.json() as ProjectResponse;
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
