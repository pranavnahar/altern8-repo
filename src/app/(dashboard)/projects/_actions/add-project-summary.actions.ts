'use server'

import { getAuthToken } from '@/utils/helpers';
import { revalidatePath } from 'next/cache';
export async function addProjectSummary(projectID: number, data: any) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/${projectID}/summaries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      revalidatePath(`/project/${projectID}`);
      return {
        success: true,
        data: result,
        status: response.status,
        message: 'Project costs updated successfully'
      };
    } else {
      return {
        success: false,
        error: result.detail || 'Failed to submit project costs',
        status: response.status,
        message: result.detail || 'An error occurred while updating project costs'
      };
    }
  } catch (error) {
    console.error('Error submitting project costs:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500,
      message: 'An unexpected error occurred'
    };
  }
}
