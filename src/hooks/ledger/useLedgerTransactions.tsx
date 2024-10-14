import { getTransactions } from '@/Utils/ledger/ledgerService';
import { useState, useEffect } from 'react';

const useLedgerTransactions = (id) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchTransactions = async (id) => {
        if (id) {
            try {
                setIsLoading(true);
                const data = await getTransactions(id);
                const approvedTransactions = data.transactions.filter(transaction => transaction.approved === true);
                setTransactions(approvedTransactions);
                return true;
            } catch (error) {
                return false;
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        handleFetchTransactions(id);
    }, []);

    return {
        isLoading,
        transactions,
        handleFetchTransactions,
    };
};

export default useLedgerTransactions;
