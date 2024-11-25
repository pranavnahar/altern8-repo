'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Account, Transaction } from './types'
import { parseCookies } from 'nookies'
import { setAccessTokenCookie } from '@/utils/auth'

async function getAuthToken() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('altern8_useraccess')
  if (!accessToken) {
    redirect('/login')
  }
  return accessToken.value
}


export const getAccessToken = async () => {
  const cookies = parseCookies();
  const refreshToken = cookies.altern8_userrefresh;

  let accessToken = "";
  const body = { refresh: refreshToken };

  const response = await fetch(`${process.env.SERVER_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const responseData = await response.json();
  accessToken = responseData.access;
  if (accessToken) {
    setAccessTokenCookie(accessToken);
    return accessToken;
  }
  return false;
};

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const token = await getAuthToken()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    const newToken = await getAccessToken()
    if (newToken) {
      return fetchWithAuth(url, options)
    } else {
      throw new Error('Unable to refresh token')
    }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch')
  }

  return response.json()
}

export async function getLedgerDetails(): Promise<{ accounts: Account[]
  otherAccounts: Account[]
  trancheIDs: string[]
  error?: string
}> {
  try {
    const data = await fetchWithAuth('/user-dashboard-api/transactions/')
    console.log("the data value for user dasdhboard api is this repsonse: ", data)
    return {
      accounts: data.accounts,
      otherAccounts: data.other_accounts,
      trancheIDs: data.tranche_ids,
    }
  } catch (error) {
    return { accounts: [], otherAccounts: [], trancheIDs: [], error: "Error fetching ledger details" }
  }
}

export async function createTransaction(formData: FormData): Promise<{ success: boolean, error?: string }> {
  try {

    console.log("calling the api transactions create")
    const data = await fetchWithAuth('/user-dashboard-api/transactions/', {
      method: 'POST',
      body: formData,
    });
    revalidatePath('/ledger');
    console.log("the creation of the trnasaction resuteled in this : ", data)
    return { success: true, error: "" };

  } catch (error) {
    console.log(error,'}test');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add transaction'
    };
  }
}

interface TransactionResponse {
  transactions: Transaction[]
}

export async function getTransactions(id: string): Promise<{
  transactions: Transaction[]
  error?: string
}> {
  try {
    const data: TransactionResponse = await fetchWithAuth(`/user-dashboard-api/transactions/${id}`);
    return {
      transactions: data.transactions,
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      transactions: [],
      error: error instanceof Error ? error.message : 'Failed to fetch transactions'
    };
  }
}
