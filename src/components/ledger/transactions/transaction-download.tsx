import { Button } from "../../../components/ui/button";
import useLedgerTransactions from "../../../hooks/ledger/transactions/use-ledger-transactions";
import { Download } from "lucide-react";
import React, { ReactNode } from "react";

const TransactionDownload = () => {
  const { handleDownloadTemplate, isDownloading, downloadError } =
    useLedgerTransactions();

  return (
    <div>
      <Button
        onClick={handleDownloadTemplate}
        className="text-white bg-primary hover:bg-primary/90"
        disabled={isDownloading}
      >
        {isDownloading ? (
          "Downloading..."
        ) : (
          <>
            <Download className="my-auto mr-2 size-4" strokeWidth={2} />
            <h1 className="my-auto">Download</h1>
          </>
        )}
      </Button>
      {downloadError && (
        <div className="mt-2 text-red-500">{downloadError as ReactNode}</div>
      )}
    </div>
  );
};

export default TransactionDownload;
