'use server'

import { Project, ProjectsResponse } from './types'
import { getAuthToken } from '@/utils/auth-actions'
import { redirect } from 'next/navigation'

const fetchProjects = async (altern8_useraccess: string): Promise<ProjectsResponse> => {
  try {
    let response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/calendar/`, {
      headers: {
        Authorization: `Bearer ${altern8_useraccess}`,
      },
    })

    if (response.status === 401) {
      const newToken = await getAuthToken()
      if (newToken) {
        response = await fetch(`${process.env.SERVER_URL}/user-dashboard-api/calendar/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        })
      } else {
        redirect('/login')
      }
    }

    if (response.ok) {
      const data: ProjectsResponse = await response.json()
      return data
    } else {
      redirect('/login')
    }
  } catch (error) {
    redirect('/login')
  }
}

export async function getCalendarEvents(): Promise<{ projects: Project[], error?: string }> {
  try {
    const token = await getAuthToken()
    const response: ProjectsResponse = await fetchProjects(token)
    return { projects: response.project_data }
  } catch (error) {
    return { projects: [], error: "Error fetching calendar projects" }
  }
}
