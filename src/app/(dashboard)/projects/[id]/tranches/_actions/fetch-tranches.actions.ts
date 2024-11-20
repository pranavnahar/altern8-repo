"use server";

import ky from "ky";
import { notFound, redirect } from "next/navigation";
import { TrancheResponse } from "../types";
import { getAuthToken } from "@/utils/auth-actions";

export async function fetchTranches(
  projectID: string,
  timeoutMs: number = 60000
): Promise<TrancheResponse> {
  async function makeRequest(token: string) {
    return ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tranches/`,
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
    let response = await makeRequest(token);

    if (response.status === 401) {
      token = await getAuthToken();
      response = await makeRequest(token);

      if (response.status === 401) {
        redirect('/login')
      }
    }

    return await response.json() as TrancheResponse;
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
