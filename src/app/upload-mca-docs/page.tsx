"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../utils/show-toasts";
import { Suspense } from 'react';

const Page = () => {
  const searchParams = useSearchParams(); 
  const queryCin = searchParams.get("cin") || ""; 
  const queryUserId = searchParams.get("userId") || ""; 

  // Initialize state directly with query values
  const [cin, setCin] = useState(queryCin);
  const [userId, setUserId] = useState(queryUserId);
  const [files, setFiles] = useState<File[]>([]);
  const { showToast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
  });

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!cin || !userId) {
      showToast({
        message: "CIN and User ID are required",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("cin", cin);
    formData.append("user_id", userId);

    files.forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      const response = await fetch(`${apiUrl}/mcadocs-api/upload/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showToast({
          message: "Uploaded the documents successfully!",
          type: "success",
        });
        // Clear form state after successful submission
        setCin("");
        setUserId("");
        setFiles([]);
      } else {
        showToast({
          message: "Please retry, document upload failed..",
          type: "error",
        });
      }
    } catch (error:any) {
      showToast({
        message: `An error occurred: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex justify-center items-center min-h-screen">
      <div className="[background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center text-zinc-100">
          Upload MCA Documents
        </h1>
        <p className="mb-6 text-center text-sm text-zinc-400">
        Please upload the required documents for this company. For your convenience, the CIN & UserID have already been pre-filled from the URL.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="cin"
              className="block text-sm font-medium text-zinc-400 mb-1"
            >
              CIN
            </label>
            <Input
              type="text"
              id="cin"
              name="cin"
              placeholder="Enter CIN"
              required
              value={cin}
              disabled={!!cin}
              onChange={(e) => setCin(e.target.value)}
              className="w-full bg-transparent text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-zinc-400 mb-1"
            >
              User ID
            </label>
            <Input
              type="text"
              id="userId"
              name="userId"
              placeholder="Enter User ID"
              required
              value={userId}
              disabled={!!userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-transparent text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Upload Documents <span className="text-red-500">*</span>
            </label>
            <div
              {...getRootProps({
                className:
                  "dropzone cursor-pointer flex items-center justify-center p-4 border-2 border-dashed border-gray-500 rounded-md bg-transparent hover:bg-black/30 transition",
              })}
            >
              <input {...getInputProps()} />
              <p className="text-sm text-zinc-400">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-2 text-sm text-zinc-400">
                <p className="text-zinc-200 mt-3">Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-1"
                    >
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700 transition text-sm w-4 h-4 flex items-center justify-center border rounded-full border-red-500 hover:bg-red-100"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
    </Suspense>
  );
};

export default Page;