'use server'

import ky from 'ky';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ProjectResponse } from './types';

async function getAuthToken() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('altern8_useraccess');
  if (!authCookie) {
    throw new Error('Not authenticated');
  }
  return authCookie.value;
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

export async function fetchBorrowersUids(timeoutMs = 60000) {
  try {
    const token = await getAuthToken();
    console.log(token)
    const response = await fetch(`${process.env.SERVER_URL}/admin-api/borrowers-uids/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch borrowers UIDs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching borrowers UIDs:', error);
    throw error;
  }
}

export async function createProject(formData: FormData) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.log("The response was not OK");
      throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
    }

    revalidatePath('/projects');
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}


type AdminApplyProductBody = {
  approval_status: boolean,
  product_id: number
}

export async function adminApplyProduct(projectId: string, body: AdminApplyProductBody) {
  const token = await getAuthToken();
  console.log('Request body:', body);

  try {
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/${projectId}/admin-apply-product/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    revalidatePath(`/projects`)
    return { success: true, data }
  } catch (error) {
    console.error('Error in adminApplyProduct:', error)
    return { success: false, error: (error as Error).message }
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
