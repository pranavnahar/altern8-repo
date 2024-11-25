'use client'
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { useToast } from "@/utils/show-toasts";
import { fetchWithAuth } from "@/utils/fetch-with-auth";

const TransactionDownload = () => {
  const [state,setState] = useState<any>({})
  const { showToast } = useToast();

 const downloadBulkTransactions = async () => {
    try {
      const response = await fetchWithAuth("/admin-api/ledger/upload-bulk-transactions/");
  
      if (!response?.ok) {
        return response?.status
      }
      // console.log(response.blob())
      const blob = await response.blob();
      console.log(blob)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bulk_transactions_template.xlsx");
  
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
    } catch (error) {
      console.error("Failed to download template:", error);
      throw error;
    }
  };
  

  const handleDownloadTemplate = async () => {
    setState((prev: any) => ({ ...prev, isDownloading: true, downloadError: null }));
    try {
     await downloadBulkTransactions();
    } catch (error) {
      console.error("Failed to download template:", error);
      showToast( {message : "Failed to download template",type :'error'});
    } finally {
      setState((prev: any) => ({ ...prev, isDownloading: false }));
    }
  };


  return (
    <div>
      <Button
        onClick={handleDownloadTemplate}
        className="w-full text-white sm:w-auto"
        disabled={state?.isDownloading}
        variant="default" 
      >
        <span className="flex items-center justify-center">
          {state?.isDownloading ? (
            "Downloading..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              <span>Download</span>
            </>
          )}
        </span>
      </Button>
    </div>
  );
};

export default TransactionDownload;