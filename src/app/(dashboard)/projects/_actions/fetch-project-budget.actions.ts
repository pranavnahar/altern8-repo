"use server"

import { getAuthToken } from '@/utils/auth-actions';
import ky from 'ky';
import { notFound, redirect } from 'next/navigation';

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



    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    return `data:application/octet-stream;base64,${base64Data}`;
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

