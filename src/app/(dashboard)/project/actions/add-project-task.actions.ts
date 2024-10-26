'use server'

import { revalidatePath } from 'next/cache';
import { getAuthToken } from '../../../../utils/helpers';

type ProjectStatus = {
  owner: string;
  status: string;
  original_start_date: Date;
  original_completion_date: Date;
  completion_date_variance: number;
};


export async function addProjectTask(projectId: number, data: ProjectStatus) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/${projectId}/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update project status');
    }

    const result = await response.json();
    revalidatePath(`/project/${projectId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
