"use server";


import ky from "ky";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { RulesResponse } from "../types";
import { getAuthToken } from "@/utils/auth-actions";

export async function fetchTrancheRules(
  projectID: number,
  trancheID: number,
  timeoutMs: number = 60000
): Promise<RulesResponse> {
  try {
    const token = await getAuthToken();
    const response = await ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/${trancheID}/rules/`,
      {
        timeout: timeoutMs,
        retry: 3,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.json() as RulesResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        redirect('/login')
      }
      if (error.name === "TimeoutError") {
        redirect('/login')
      }
      if (error.name === "HTTPError" && error.message.includes("404")) {
        notFound();
      }
    }
    throw error;
  }
}

interface InputValue {
  threshold: number;
}

interface TrancheRuleData {
  project: number;
  tranche: number;
  rule_type: string;
  description: string;
  is_active: boolean;
  input_value: InputValue;
  id?: number;
}
export async function createTrancheRule(data: TrancheRuleData) {
  try {
    const token = await getAuthToken();
    const url = `${process.env.SERVER_URL}/rablet-api/projects/${data.project}/tranches/${data.tranche}/rules/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project: data.project,
        tranche: data.tranche,
        rule_type: data.rule_type,
        description: data.description,
        is_active: data.is_active,
        input_value: {
          threshold: data.input_value.threshold
        }
      })
    });
    const result = await response.json();

    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    console.error('Error creating tranche rule:', error);
    throw error;
  }
}

export async function updateTrancheRule(data: TrancheRuleData) {

  try {
    const url = `${process.env.SERVER_URL}/rablet-api/projects/${data.project}/tranches/${data.tranche}/rules/${data.id}/`;
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
        rule_type: data.rule_type,
        description: data.description,
        is_active: data.is_active,
        input_value: {
          threshold: data.input_value.threshold
        }
      })
    });

    const result = await response.json();
    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteTrancheRule(projectId: number, trancheId: number, ruleId: number) {
  try {
    const url = `${process.env.SERVER_URL}/rablet-api/projects/${projectId}/tranches/${trancheId}/rules/${ruleId}/`;
    const token = await getAuthToken()
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    revalidatePath(`/projects/${projectId}/tranches/${trancheId}`);

    return true;
  } catch (error) {
    console.error('Error deleting tranche rule:', error);
    throw error;
  }
}
