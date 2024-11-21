'use server'

import ky from 'ky';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ProjectResponse } from './types';

async function getAuthToken() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('altern8_adminaccess');
  return authCookie?.value;
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
      // console.log("The response was not OK");
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
  product_id: number,
  agreement: number | null;
}

export async function adminApplyProduct(projectId: string, body: AdminApplyProductBody) {
  // console.log("applied the product and called the api");
  console.log("the project id that is received is this: ", projectId);
  const token = await getAuthToken();

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
    revalidatePath(`/projects`);

    return { success: true, data }
  } catch (error) {
    console.error('Error in adminApplyProduct:', error)
    return { success: false, error: (error as Error).message }
  }
}

type TemplateIdsType = {
  [key: number]: number; 
};

const templateIds: TemplateIdsType = {
  1: 16658,
  2: 16656,
  3: 16657,
}

export async function initiateEmudraFlow(projectId: string,templateId: number, productList: any[]){
  const token = await getAuthToken();

  try {
    console.log("the call was made to this api and got this as the values: \n ", templateId, productList);
    console.log(" the project id that was used to init the bakend is: ", projectId);
    //processing and what data to send yet to be done over here
    const id = templateIds[templateId];
    const pid = projectId;
    console.log("template id: ", id)
    const body = {
      id, //workflow to be created based on it
      productList,
      pid
    }

    const response = await fetch(`${process.env.SERVER_URL}/emudhra-api/initEsigning/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(body), 
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    console.log("the server returned this: ", data);

    return { success: true, data }
  
  } catch (error) {
    console.error('Error in initiateEmudraFlow:', error)
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
