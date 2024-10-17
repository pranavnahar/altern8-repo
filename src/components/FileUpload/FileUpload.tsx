import Image from 'next/image';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  className?: string;
  label?: string;
}

interface FileWithPreview extends File {
  preview: string;
}

const getFileType = (file: File) => {
  const fileType = file.type.split('/')[0];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'image') {
    return 'image';
  }
  if (['xls', 'xlsx', 'csv'].includes(fileExtension || '')) {
    return 'excel';
  }
  return 'other';
};

const CustomFilePreview = ({ file }: { file: FileWithPreview }) => {
  const fileType = getFileType(file);

  return (
    <div className="flex w-24 flex-col items-center justify-center mx-auto">
      {fileType === 'image' ? (
        <div className="w-24 h-24 relative">
          <Image
            src={file.preview}
            alt={file.name}
            className="w-full h-full text-white text-xs truncate object-cover rounded"
            fill
          />
        </div>
      ) : (
        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded">
          {fileType === 'excel' && <FileSpreadsheet className="text-4xl text-green-600" />}
          {fileType === 'other' && <FileText className="text-4xl text-gray-600" />}
        </div>
      )}
      <p
        title={file.name}
        className="text-white text-center my-1 text-xs truncate w-[90%] mx-auto"
      >
        {file.name}
      </p>
    </div>
  );
};

const FileUpload = ({ onDrop: handleChange, className, label }: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]); // Initialize files as an empty array

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles); // Log dropped files

    const newFiles = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    console.log('New files with preview URLs:', newFiles); // Log new files with previews
    
    // Update files state and log the previous and new files
    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, ...newFiles];
      console.log('Updated files state:', updatedFiles); // Log updated files state
      return updatedFiles; // Return updated files array
    });
    
    handleChange(newFiles); // Call the parent function with the new files
  }, [handleChange]);

  // Log the files whenever they change
  useEffect(() => {
    console.log('Current files:', files);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      {label && <p className="text-white text-xs mb-2 mt-5">{label}</p>}

      <div
        className={`p-8 flex items-center justify-center rounded-lg mt-1 mb-2 text-gray-300 border border-dashed border-neutral-200 ${className}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center justify-center text-sm">
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 items-center grid-cols-3">
        {files.map((file, fileIndex) => (
          <CustomFilePreview file={file} key={`${file.name}-${fileIndex}`} />
        ))}
      </div>
    </div>
  );
};

export default FileUpload;