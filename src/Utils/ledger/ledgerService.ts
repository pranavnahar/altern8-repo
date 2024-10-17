import { showToast } from '../../Helpers/show-toasts';
import { fetchWithAuth } from '../fetch-with-auth';
import { formData } from '../../components/DashboardTableFilter/AddProjectFormModal';
fetchWithAuth;
export const getTransactions = async (id: string) => {
  const response = await fetchWithAuth(`/user-dashboard-api/transactions/${id}`);
  if (!response?.ok) throw new Error('Failed to fetch Accounts');
  return response?.json();

  return {
    transactions: [
      {
        id: 38,
        invoice_product: 4,
        transaction_id: '3453473453',
        amount: '11110.00',
        transaction_date: '2024-07-25 06:35:00',
        timestamp: '2024-07-25T12:05:00+05:30',
        from_account: 1,
        to_account: 2,
        purpose: 'Principal',
        balance: 90778,
        approved: true,
        type: 'Debit',
      },
      {
        id: 45,
        invoice_product: 3,
        transaction_id: '122344556',
        amount: '12000.00',
        transaction_date: '2024-09-21 18:30:00',
        timestamp: '2024-09-22T00:00:00+05:30',
        from_account: 1,
        to_account: 2,
        purpose: 'Principal',
        balance: 78778,
        approved: true,
        type: 'Debit',
      },
      {
        id: 49,
        invoice_product: 4,
        transaction_id: '22334455',
        amount: '10000.00',
        transaction_date: '2024-09-22 18:30:00',
        timestamp: '2024-09-23T00:00:00+05:30',
        from_account: 1,
        to_account: 2,
        purpose: 'Principal',
        balance: 66378,
        approved: true,
        type: 'Debit',
      },
      {
        id: 40,
        invoice_product: 4,
        transaction_id: '3453473453',
        amount: '11111.00',
        transaction_date: '2024-10-02 18:30:00',
        timestamp: '2024-10-03T00:00:00+05:30',
        from_account: 1,
        to_account: 2,
        purpose: 'Principal',
        balance: 78778,
        approved: true,
        type: 'Debit',
      },
      {
        id: 52,
        invoice_product: 4,
        transaction_id: '123456789',
        amount: '2400.00',
        transaction_date: '2024-10-02 18:30:00',
        timestamp: '2024-10-03T00:00:00+05:30',
        from_account: 1,
        to_account: 2,
        purpose: 'Platform fees',
        balance: 76378,
        approved: true,
        type: 'Debit',
      },
    ],
  };
};

export const getLedgerDetails = async () => {
  const response = await fetchWithAuth(`/user-dashboard-api/transactions/`);
  if (!response?.ok) throw new Error('Failed to fetch Details');
  return response?.json();
  // return {
  //     "invoice_ids": [
  //         [
  //             4,
  //             "invoices/dummy_pdf_4_tfJtQuv.pdf"
  //         ],
  //         [
  //             3,
  //             "invoices/dummy_pdf_2_ULUEqfb.pdf"
  //         ],
  //         [
  //             19,
  //             "invoices/dummy_pdf_2_ULUEqfb.pdf"
  //         ],
  //         [
  //             20,
  //             "invoices/dummy_pdf_2_ULUEqfb.pdf"
  //         ],
  //         [
  //             22,
  //             "invoices/dummy_pdf_2_ULUEqfb.pdf"
  //         ],
  //         [
  //             93,
  //             "invoices/gst_document.pdf"
  //         ],
  //         [
  //             94,
  //             "invoices/dummy_pdf_4_dacxNjY_1_2Vbea0M.pdf"
  //         ],
  //         [
  //             95,
  //             "invoices/dummy_pdf_4_dacxNjY_1.pdf"
  //         ],
  //         [
  //             96,
  //             "invoices/dummy_pdf_2_ULUEqfb_1.pdf"
  //         ]
  //     ],
  //     "accounts": [
  //         {
  //             "id": 1,
  //             "name": "Real account of seller",
  //             "account_type": "Real Account of Sellers",
  //             "account_number": "2000123001112",
  //             "balance": 66378
  //         },
  //         {
  //             "id": 3,
  //             "name": "shared account of buyer and seller",
  //             "account_type": "Shared Virtual Account of Buyer and Seller",
  //             "account_number": "342345524534534",
  //             "balance": 0
  //         },
  //         {
  //             "id": 4,
  //             "name": "virtual account example",
  //             "account_type": "Shared Virtual Account of Buyer and Seller",
  //             "account_number": "12313341233123",
  //             "balance": 0
  //         },
  //         {
  //             "id": 6,
  //             "name": "new account",
  //             "account_type": "account type virtual",
  //             "account_number": "123123123123",
  //             "balance": 1200000
  //         },
  //         {
  //             "id": 7,
  //             "name": "shared virtual between seller-buyer",
  //             "account_type": "Shared Virtual Account of Buyer and Seller",
  //             "account_number": "200012300432",
  //             "balance": 12000
  //         },
  //         {
  //             "id": 9,
  //             "name": "hdhhghghh",
  //             "account_type": "virtual account for new users 12",
  //             "account_number": "11111222",
  //             "balance": 1000
  //         }
  //     ],
  //     "other_accounts": [
  //         {
  //             "id": 2,
  //             "name": "Admin Account",
  //             "account_number": "231232534234"
  //         },
  //         {
  //             "id": 5,
  //             "name": "sdfsd",
  //             "account_number": "4242342432"
  //         },
  //         {
  //             "id": 8,
  //             "name": "Real Account of Seller",
  //             "account_number": "2233445566"
  //         }
  //     ]
  // }
};

export const createTransactions = async (formData: formData) => {
  try {
    const response = await fetchWithAuth('/user-dashboard-api/transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response?.ok) {
      const errorData = await response?.json();
      const errorMessage = errorData.message || 'Failed to add transactions';
      showToast(errorMessage);
      return null;
    } else {
      showToast('Transaction submitted');
      return response.json();
    }
  } catch (error) {
    showToast('An unexpected error occurred. Please try again later.');
    return null;
  }
};
