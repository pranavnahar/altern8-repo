import { getAccessToken } from "../../../Utils/auth";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let accessToken = parseCookies().altern8_useraccessAdmin;
const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const router = useRouter();
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    const token = await getAccessToken();

    if (!token) {
      router.push("/login");
    } else {
      accessToken = token;
    }

    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return response;
};

export const getLedgerRules = async () => {
  const response = await fetchWithAuth("/admin-api/ledger/rules/");
  if (!response.ok) throw new Error("Failed to fetch rules");
  return response.json();
};

export const addLedgerRule = async (data: {
  [key: string]: string | number | Date | null;
}) => {
  const response = await fetchWithAuth("/admin-api/ledger/rules/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to add rule");
  return response.json();
};

export const updateLedgerRule = async (
  data: { [key: string]: string | number | Date | null },
  id: string
) => {
  console.log("id: ", id);
  const response = await fetchWithAuth(`/admin-api/ledger/rules/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to add rule");
  return response.json();
};

export const deleteLedgerRule = async (id: string) => {
  const response = await fetchWithAuth(`/admin-api/ledger/rules/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to add rule");
  return response.json();
};
