"use server"

import { getAuthToken } from '@/utils/auth-actions';
import ky from 'ky';
import { notFound, redirect } from 'next/navigation';

export async function fetchProjectInventory(projectID: number, timeoutMs: number = 60000) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/${projectID}/inventories/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });



    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        redirect('/login')
      }
      if (error.name === 'TimeoutError') {
        redirect('/login')
      }
      if (error.name === 'HTTPError' && error.message.includes('404')) {
        notFound();
      }
    }
    throw error;
  }
}


export async function addProjectInventory(projectId: number, data: any) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/projects/${projectId}/tranches/${projectId}/inventories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function get(path: string) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}${path}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

export async function editProjectInventory(id: number, data: any) {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${process.env.SERVER_URL}/rablet-api/inventories/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
