"use server";
import { getAuthToken } from "@/utils/helpers";
import ky from "ky";
import { notFound } from "next/navigation";

export async function fetchProjectTask(
  projectID: number,
  timeoutMs: number = 60000
) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/tasks/`,
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

    return await response.json();
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


export async function fetchProjectTaskTimeLine(
  projectID: number,
  filter: string,
  timeoutMs: number = 60000,
) {
  try {
    const token = await getAuthToken();
    const response = await ky.get(
      `${process.env.SERVER_URL}/rablet-api/projects/${projectID}/timeline/?filter=${filter}`,
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

    return await response.json();
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
