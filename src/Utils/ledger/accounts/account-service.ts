import { getAccessToken } from "../../auth";
//import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
let accessToken = parseCookies().altern8_useraccessAdmin;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface AccountData {
  description: string;
  is_virtual: boolean;
}

const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  //const router = useRouter();
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
      window.location.replace("/login");
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

export const getAccounts = async () => {
  const response = await fetchWithAuth("/admin-api/ledger/accounts/");
  if (!response.ok) throw new Error("Failed to fetch accounts");
  return response.json();
};

export const addAccount = async (
  data:
    | AccountData
    | { name: string; account_number: string; account_type: string }
) => {
  const response = await fetchWithAuth("/admin-api/ledger/accounts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to add account");
  return response.json();
};

export const changeAccountStatus = async (
  accountId: string,
  action: string
) => {
  const response = await fetchWithAuth(
    `/admin-api/ledger/account-change-status/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: accountId, action }),
    }
  );
  if (!response.ok) throw new Error("Failed to update account status");
  return response.json();
};

export const editAccountTypes = async (accountData: AccountData) => {
  const response = await fetchWithAuth(`/ledger/account-types/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  });
  if (!response.ok) throw new Error("Failed to update account types");
  return response.json();
};

export const createAccountsTypes = async (data: AccountData) => {
  console.log("Data received in createAccountsTypes:", data);
  const response = await fetchWithAuth("/admin-api/ledger/account-types/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to add account type");
  return response.json();
};

export const getAccountsTypes = async () => {
  const response = await fetchWithAuth("/admin-api/ledger/account-types/");
  if (!response.ok) throw new Error("Failed to fetch account types");
  return response.json();
};

export const updateAccountsType = async (data: AccountData) => {
  const response = await fetchWithAuth("/admin-api/ledger/account-types/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update account type");
  return response.json();
};
