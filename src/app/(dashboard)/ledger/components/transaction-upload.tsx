'use client'
import { useState } from "react";
// import { uploadBulkTransactions } from "../../../utils/ledger/transactions/transactions-service";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/utils/show-toasts";
import { uploadBulkTransactions } from "../actions";
import { getAuthToken } from "@/utils/server-auth";

const TransactionUpload: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploadProgress, setUploadProgress] = useState(0);
  console.log(uploadProgress);
  const { showToast } = useToast();


  const handleUploadSuccess = () => {
    showToast({
      message: "Upload successfully",
      type: "success",
    });
  };

  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };

  const uploadBulkTransactions = async (
    formData: FormData,
    setUploadProgress?: (arg: number) => void
  ) => {
    const { showToast } = useToast()
    try {
      const token = await getAuthToken()
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/admin-api/ledger/upload-bulk-transactions/`, true);
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
            showToast({
              message: JSON.parse(xhr.responseText).error,
              type: "error"
            });
            reject(new Error(`HTTP error! status: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(formData);
      });
    } catch (error) {
      showToast({
        message: "Some internal error occured",
        type: "error"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const data = await uploadBulkTransactions(formData, setUploadProgress);
      handleUploadSuccess();
      setIsOpen(false);
    } catch (error) {
      setErrorMessage("");
      console.log(error,'error-imhh')
      setSelectedFile(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto" variant="default">
          <span className="flex items-center justify-center">
            <Upload className="mr-2 h-4 w-4" strokeWidth={1.75} />
            <span>Upload File</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-10 bg-gradient-to-br from-[#021457] via-[#19112f] to-[#6e3050] overflow-y-auto w-[30vw] scroll border-none text-white">
        <DialogHeader>
          <DialogTitle className="mt-2 font-medium">Upload File</DialogTitle>
        </DialogHeader>
        <div className="input-text-white">
          <Input
            type="file"
            onChange={handleFileChange}
            className="w-full transition-colors bg-transparent border border-dashed rounded-md outline-none appearance-none cursor-pointer focus:outline-none focus:border-purple-600 text-white border-neutral-300/70 placeholder:text-neutral-100 hover:bg-neutral-950/20 animation"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-transparent border-primary animation hover:text-white hover:bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionUpload;
