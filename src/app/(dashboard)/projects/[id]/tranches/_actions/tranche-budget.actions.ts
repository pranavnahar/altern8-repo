"use server";

import { getAuthToken } from "@/utils/auth-actions";
import ky from "ky";
import { notFound } from "next/navigation";
import { Budget, BudgetResponse } from "../types";
import { revalidatePath } from "next/cache";

export async function fetchTrancheBudget(
  projectID: number,
  trancheID: number,
  timeoutMs: number = 60000
): Promise<BudgetResponse> {
  try {
    const token = await getAuthToken();
    const response = await ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/${trancheID}/budgets/`,
      {
        timeout: timeoutMs,
        retry: 3,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return await response.json() as BudgetResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        throw new Error(
          "You are not authorized to access this resource. Please log in again."
        );
      }
      if (error.name === "TimeoutError") {
        throw new Error("Request timed out");
      }
      if (error.name === "HTTPError" && error.message.includes("404")) {
        notFound();
      }
    }
    throw error;
  }
}

export async function createTrancheRule(data: Budget) {
  try {
    const token = await getAuthToken();
    const url = `${process.env.SERVER_URL}/rablet-api/budgets/tranches/${data.tranche}/rules/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project: data.project,
        tranche: data.tranche,
        original_budget: data.original_budget,
        adjustments: data.adjustments,
        amount_requested: data.amount_requested,
        amount_used: data.amount_used,
        current_budget: data.current_budget,
        balance_to_fund: data.balance_to_fund,
        percentage_remaining: data.percentage_remaining
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create tranche rule');
    }

    const result = await response.json();
    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    console.error('Error creating tranche rule:', error);
    throw error;
  }
}
