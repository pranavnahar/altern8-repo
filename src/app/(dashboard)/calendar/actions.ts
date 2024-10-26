'use server'

import { cookies } from 'next/headers'
import { Project, ProjectsResponse } from './types'
import { redirect } from 'next/navigation';

async function getAuthToken() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('altern8_useraccess');
  if (!accessToken) {
    redirect('/login')
  }
  return accessToken.value;
}

const fetchProjects = async (altern8_useraccess: string): Promise<ProjectsResponse> => {
  try {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard-api/calendar/`, {
      headers: {
        Authorization: `Bearer ${altern8_useraccess}`,
      },
    })

    if (response.status === 401) {
      const newToken = await getAuthToken()
      if (newToken) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-dashboard-api/calendar/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        })
      } else {
        throw new Error('Unable to refresh token')
      }
    }

    if (response.ok) {
      const data: ProjectsResponse = await response.json()
      return data
    } else {
      throw new Error('Failed to fetch events')
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export async function getCalendarEvents(): Promise<{ projects: Project[], error?: string }> {
  const cookieStore = cookies()
  const altern8_useraccess = cookieStore.get('altern8_useraccess')

  if (!altern8_useraccess) {
    return { projects: [], error: "Access token is missing" }
  }

  try {
    const response: ProjectsResponse = await fetchProjects(altern8_useraccess.value)
    return { projects: response.project_data }
  } catch (error) {
    console.error('Error fetching calendar projects:', error)
    return { projects: [], error: "Error fetching calendar projects" }
  }
}
