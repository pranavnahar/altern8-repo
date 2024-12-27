'use server';

import ky from 'ky';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ProjectResponse } from './types';
import { getAuthToken } from '@/utils/auth-actions';

import { EsignResponse, EsignStatus } from './types';

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

export async function fetchBorrowersUids(timeoutMs = 60000) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/admin-api/borrowers-uids/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createProject(formData: FormData) {
  console.log(formData);
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const responseData = await response.json();

    revalidatePath('/projects');
    return { success: true, data: responseData };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

type AdminApplyProductBody = {
  approval_status: boolean;
  product_id: number;
  agreement: number | null;
};

export async function adminApplyProduct(projectId: string, body: AdminApplyProductBody) {
  const token = await getAuthToken();

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectId}/admin-apply-product/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    revalidatePath(`/projects`);

    return { success: true, data };
  } catch (error) {
    console.error('Error in adminApplyProduct:', error);
    return { success: false, error: (error as Error).message };
  }
}

type TemplateIdsType = {
  [key: number]: number;
};

const templateIds: TemplateIdsType = {
  1: 16658,
  2: 16656,
  3: 16657,
};

export async function initiateEmudraFlow(
  projectId: string,
  templateId: number,
  productList: any[],
) {
  try {
    const token = await getAuthToken();
    const id = templateIds[templateId];
    const pid = projectId;
    const body = {
      id,
      productList,
      pid,
    };

    const response = await fetch(`${process.env.SERVER_URL}/emudhra-api/initEsigning/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function checkEsignStatus(projectIds: number[]): Promise<EsignResponse> {
  const token = await getAuthToken();

  try {
    console.log('The call was made to this API with these project IDs:', projectIds);

    const body = {
      projectId: projectIds,
    };

    const response = await fetch(`${process.env.SERVER_URL}/emudhra-api/checkEsignStatus/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: Record<string, { workflow_status: string | null; url: string | null }> =
      await response.json();

    const parsedData: EsignStatus[] = Object.entries(data).map(
      ([projectId, { workflow_status, url }]) => ({
        projectId: parseInt(projectId, 10),
        workflow_status, // Include if required by your type
        status:
          workflow_status === null || workflow_status === 'incomplete'
            ? 'not started'
            : workflow_status,
        url: url || null,
      }),
    );

    console.log('Parsed project statuses:', parsedData);

    return { success: true, data: parsedData };
  } catch (error) {
    console.error('Error in check esign status:', error);
    return { success: false, data: [], error: (error as Error).message };
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
