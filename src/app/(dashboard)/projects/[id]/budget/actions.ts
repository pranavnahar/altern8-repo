"use server"

import { getAuthToken } from "@/utils/auth-actions";

export async function projectOriginalBudet(projectID: number) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/budgets/${projectID}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const result = await response.json();
    console.log("fhjksd", result)

    if (response.ok) {
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
