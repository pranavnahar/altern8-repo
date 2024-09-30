import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { uploadBulkTransactions } from "../../../Utils/ledger/transactions/transactions-service";
import { Input } from "../../../components/ui/input";
import { Upload } from "lucide-react";
import { showToast } from "../../../Utils/showToast";

const TransactionUpload: React.FC<{
  onUploadSuccess: (data: object) => void;
}> = ({ onUploadSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploadProgress, setUploadProgress] = useState(0);
  console.log(uploadProgress);

  const [errorMessage, setErrorMessage] = useState("");
  console.log(errorMessage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
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
      onUploadSuccess(data);
      setIsOpen(false);
    } catch (error) {
      setErrorMessage("");
      showToast("An error occurred during file upload.", "false");
      setSelectedFile(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Upload strokeWidth={1.75} className="my-auto mr-2 size-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-10 bg-gradient-to-br from-[#021457] via-[#19112f] to-[#6e3050] overflow-y-scroll scroll border-none">
        <DialogHeader>
          <DialogTitle className="mt-2 font-medium">Upload File</DialogTitle>
        </DialogHeader>
        {/* {errorMessage && <div className="text-red-500">{errorMessage}</div>} */}
        <Input
          type="file"
          onChange={handleFileChange}
          className="w-full transition-colors bg-transparent border border-dashed rounded-md outline-none appearance-none cursor-pointer focus:outline-none focus:border-purple-600 text-neutral-200 border-neutral-300/70 placeholder:text-neutral-100 hover:bg-neutral-950/20 animation"
        />
        {/* {uploadProgress > 0 && (
          <div className="flex items-center mt-2">
            <progress value={uploadProgress} max="100" className='h-5 rounded-full bg-primary' />
            <span className="ml-2">{uploadProgress}%</span>
          </div>
        )} */}
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
            className="bg-primary hover:bg-primary/90"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionUpload;
