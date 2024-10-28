"use client"

import { parseCookies } from "nookies";
import { getAccessToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {}
) => {
  let accessToken = parseCookies().altern8_useraccess;

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const token = await getAccessToken();

    if (!token) {
      window.location.href = "/login";
      return;
    } else {
      accessToken = token;
    }

    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
};
