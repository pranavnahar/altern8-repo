"use server";

import ky from "ky";
import { notFound, redirect } from "next/navigation";
import { Budget, BudgetResponse } from "../types";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/utils/auth-actions";

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

    return await response.json() as BudgetResponse;
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

export async function createTrancheBudget(data: Budget) {
  try {
    const token = await getAuthToken();
    const url = `${process.env.SERVER_URL}/rablet-api/budgets/tranches/${data.tranche}/budgets/`;

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
      redirect('/login')
    }

    const result = await response.json();
    revalidatePath(`/projects/${data.project}/tranches`);

    return result;
  } catch (error) {
    throw error;
  }
}
