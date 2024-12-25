"use server"


import { TaksResponse } from "../types";
import ky from "ky";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/utils/auth-actions";

export async function fetchTrancheTasks(projectID: number, trancheID: number, timeoutMs: number = 60000): Promise<TaksResponse> {
  async function makeRequest(token: string) {
    return ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/${trancheID}/tasks/`,
      {
        timeout: timeoutMs,
        retry: 3,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  try {
    let token = await getAuthToken();
    let response = await makeRequest(token!);

    if (response.status === 401) {
      token = await getAuthToken();
      response = await makeRequest(token!);

      if (response.status === 401) {
        redirect('/login')
      }
    }

    return await response.json() as TaksResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        redirect('/login')
      }
      if (error.name === "TimeoutError") {
        redirect('/login')
      }
      if (error.name === "HTTPError" && error.message.includes("404")) {
        redirect('/404')
      }
    }
    throw error;
  }
}

interface TrancheTaskData {
  id?: number;
  tranche: number;
  project: number;
  owner: string;
  status: string;
  original_start_date: string;
  original_completion_date: string;
}

export async function createTrancheTask(data: TrancheTaskData) {
  try {
    const token = await getAuthToken();
    const url = `${process.env.SERVER_URL}/rablet-api/projects/${data.project}/tranches/${data.tranche}/tasks/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project: data.project,
        tranche: data.tranche,
        owner: data.owner,
        status: data.status,
        original_start_date: data.original_start_date,
        original_completion_date: data.original_completion_date,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
    }

    const result = await response.json();

    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    console.error('Error creating tranche task:', error);
    throw error;
  }
}

export async function updateTrancheTask(data: TrancheTaskData) {

  try {
    const url = `${process.env.SERVER_URL}/rablet-api/projects/${data.project}/tranches/${data.tranche}/tasks/${data.id}/`;
    const token = await getAuthToken()
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        project: data.project,
        tranche: data.tranche,
        owner: data.owner,
        status: data.status,
        original_start_date: data.original_start_date,
        original_completion_date: data.original_completion_date,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
    }

    const result = await response.json();
    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    console.error('Error updating tranche task:', error);
    throw error;
  }
}
