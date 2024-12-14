'use server'

import { revalidatePath } from 'next/cache'
import { Account, Transaction } from './types'
import { getAuthToken } from '@/utils/auth-actions'


async function fetchWithAuth(url: string, options: RequestInit = {},file : boolean = false): Promise<any> {
  const token = await getAuthToken()
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })

  return file ? response : response.json()
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadBulkTransactions = async (
  formData: FormData,
  setUploadProgress?: (arg: number) => void
) => {
  try {
    const token = await getAuthToken()
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/admin-api/ledger/upload-bulk-transactions/`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && setUploadProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {

          reject(new Error(`HTTP error! status: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  } catch (error) {
    console.log(error)
  }
};


