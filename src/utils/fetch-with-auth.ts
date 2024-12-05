import { getAuthToken } from "./auth-actions";

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {}
) => {
  const token = await getAuthToken()

  let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
