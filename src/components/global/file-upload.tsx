import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  className? : string
}

interface FileWithPreview extends File {
  preview: string;
}

const getFileType = (file: File) => {
  const fileType = file.type.split("/")[0];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileType === "image") {
    return "image";
  }
  if (["xls", "xlsx", "csv"].includes(fileExtension || "")) {
    return "excel";
  }
  return "other";
};

const CustomFilePreview = ({ file }: { file: FileWithPreview }) => {
  const fileType = getFileType(file);

  return (
    <div className="flex w-24 flex-col items-center justify-center mx-auto">
      {fileType === "image" ? (
        <div className="  w-24 h-24 relative ">
          <Image
            src={file.preview}
            alt={file?.name}
            className="w-full h-full text-white text-xs truncate object-cover rounded"
            fill
          />
        </div>
      ) : (
        <div className=" w-24 h-24 flex items-center justify-center bg-gray-200 rounded">
          {fileType === "excel" && (
            <FileSpreadsheet className="text-4xl text-green-600" />
          )}
          {fileType === "other" && (
            <FileText className="text-4xl text-gray-600" />
          )}
        </div>
      )}
      <p
        title={file?.name}
        className="text-white text-center my-1 text-xs truncate w-[90%] mx-auto"
      >
        {file?.name}
      </p>
    </div>
  );
};

const FileUpload = ({ onDrop: handleChange ,className}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>();

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => (prevFiles ? [...prevFiles, ...newFiles] : newFiles));
    handleChange(acceptedFiles); // Pass the files back to the form
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        className={`p-8 flex items-center justify-center rounded-lg mt-1 mb-2 text-gray-300 border border-dashed border-neutral-200 ${className}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p>Drag 'n' drop some files here, or click to select files</p>
            {/* <p>{JSON.stringify(formData[item?.name])}</p> */}
          </div>
        )}
      </div>
      <div className=" mt-4 flex flex-wrap gap-3 items-center grid-cols-3">
        {files?.map((file, fileIndex) => (
          <CustomFilePreview file={file} key={fileIndex} />
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
