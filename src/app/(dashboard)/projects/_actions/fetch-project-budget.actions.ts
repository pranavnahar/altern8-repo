"use server"

import ky from 'ky';
import { notFound } from 'next/navigation';
import { getAuthToken } from '@/utils/auth-actions';

export async function fetchProjectBudget(projectID: number, timeoutMs: number = 60000) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/budgets/${projectID}/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    return await response.json();
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

export async function fetchProjectBudgetFile(projectID: number, timeoutMs: number = 60000) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(`${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/${projectID}/budget-template/`, {
      timeout: timeoutMs,
      retry: 3,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    return `data:application/octet-stream;base64,${base64Data}`;
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

