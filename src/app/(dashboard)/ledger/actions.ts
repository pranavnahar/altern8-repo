'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Account, Transaction } from './types'
import { parseCookies } from 'nookies'
import { setAccessTokenCookie } from '@/Utils/auth'

async function getAuthToken() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('altern8_useraccess')
  if (!accessToken) {
    redirect('/login')
  }
  return accessToken.value
}


// get new access token from a refresh token
export const getAccessToken = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

  const cookies = parseCookies();
  const refreshToken = cookies.altern8_userrefresh || localStorage.getItem("Rtoken");

  let accessToken = "";
  const body = { refresh: refreshToken };

  const response = await fetch(`${apiUrl}/token/refresh/`, {
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
  console.log(token)
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

export async function getLedgerDetails(): Promise<{
  accounts: Account[]
  otherAccounts: Account[]
  trancheIDs: string[]
  error?: string
}> {
  try {
    const data = await fetchWithAuth('/user-dashboard-api/transactions/')
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
    // const payload = {
    //   transaction_id: formData.get('transaction_id'),
    //   purpose: formData.get('purpose'),
    //   amount: formData.get('amount'),
    //   description: formData.get('description') || '',
    //   status: formData.get('status'),
    //   receipt: formData.get('receipt'),
    //   timestamp: formData.get('timestamp') || new Date().toISOString(),
    //   tranche: Number(formData.get('tranche')),
    //   from_account: Number(formData.get('from_account')),
    //   to_account: Number(formData.get('to_account'))
    // };
    const data = await fetchWithAuth('/user-dashboard-api/transactions/', {
      method: 'POST',
      body: formData,
    });
    revalidatePath('/ledger');
    return { success: true, error: "" };

  } catch (error) {
    console.log(error);
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
