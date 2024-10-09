import { IconDownload } from '@tabler/icons-react';
import { Button } from '../../../components/ui/button';
import useLedgerTransactions from '../../../hooks/ledger/transactions/use-ledger-transactions';
import React, { ReactNode } from 'react';

const TransactionDownload = () => {
  const { handleDownloadTemplate, isDownloading, downloadError } = useLedgerTransactions();

  return (
    <div>
      <Button
        size="sm"
        className="text-sm"
        onClick={handleDownloadTemplate}
        disabled={isDownloading}
      >
        {isDownloading ? (
          'Downloading...'
        ) : (
          <>
            <h1 className="my-auto">Download</h1>
          </>
        )}
      </Button>
      {downloadError && <div className="mt-2 text-red-500">{downloadError as ReactNode}</div>}
    </div>
  );
};

export default TransactionDownload;
