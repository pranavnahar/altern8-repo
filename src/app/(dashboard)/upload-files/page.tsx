'use client';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { getAccessToken } from '../../../utils/auth';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { IconCloudUpload } from '@tabler/icons-react';
import { useToast } from '../../../utils/show-toasts';
import Pdf from '@/assets/pdf';

const Page = () => {
  const [file, setFile] = useState<File>();
  const { showToast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [loadingSpinner, setLoadingSpinner] = useState<boolean>(false); // for loading animation

  // mui default styles for the upload button
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const router = useRouter();

  // Handle token
  let accessToken = parseCookies().altern8_useraccess; //access token from cookies

  // if not accessToken then ask for refresh token
  const ReplaceTokenOrRedirect = async () => {
    // get new access token with help of Refresh token
    const token = await getAccessToken();
    // if not able to get the token then redirect to login
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  // handle file change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Button clicked');

    const fileInput = event.target;
    const file: File | null = fileInput.files?.[0] || null;

    if (file) {
      console.log('Selected file:', file);
      // Check if the selected file is a PDF

      if (
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        // Check if the file size is below 5MB
        if (file.size <= 5 * 1024 * 1024) {
          // You can handle the file here or pass it to a parent component using the onFileChange callback

          console.log('file is ready:', file);
          setFile(file);

          const formData = new FormData();
          formData.append('file', file);

          try {
            setLoadingSpinner(true);

            if (!accessToken) {
              await ReplaceTokenOrRedirect();
            }

            let response = await fetch(`${apiUrl}/user-dashboard-api/other-document/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              body: formData,
            });

            if (response.status === 401) {
              await ReplaceTokenOrRedirect();
              // Again try to fetch the data
              response = await fetch(`${apiUrl}/user-dashboard-api/other-document/`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
              });
            }

            if (response.ok) {
              await response.json();
              // console.log("File uploaded successfully:", responseData);
              showToast(`File uploaded successfully`, 'info');
            } else {
              console.error('Error uploading file:');
              showToast(`File upload failed!`, 'info');
            }

            // after using the file, clear the input to allow selecting a new file.
            fileInput.value = '';
          } catch (error) {
            console.log('Error uploading file', error);
            showToast(`File upload failed!`, 'info');
          } finally {
            setLoadingSpinner(false);
          }
        } else {
          alert('File size exceeds 5MB limit. Please choose a smaller file.');
          fileInput.value = ''; // Clear the input to allow selecting a new file
        }
      } else {
        alert('Please choose a PDF or Excel file.');
        fileInput.value = ''; // Clear the input to allow selecting a new file
      }
    }
  };

  return (
    <div className="min-h-screen mt-10">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 z-50 [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
          <div className="relative">
            <LoadingSpinner />
          </div>
        </div>
      )}
      <div className="mt-15 pb-10 rounded-lg flex flex-col gap-12">
        <div className="text-3xl text-white font-semibold text-white-font text-center py-5">
          Files & Documents
        </div>
        {/* previous file uploads */}
        <div className="flex justify-center gap-20 mx-6">
          <div className="text-center cursor-pointer grid gap-5">
            <Pdf />
            <div className="text-zinc-300">Accounts.pdf</div>
          </div>
          <div className="text-center cursor-pointer grid gap-5">
            <Pdf />
            <div className="text-zinc-300">Accounts.pdf</div>
          </div>
          <div className="text-center cursor-pointer grid gap-5">
            <Pdf />
            <div className="text-zinc-300">Accounts.pdf</div>
          </div>
          <div className="text-center cursor-pointer grid gap-5">
            <Pdf />
            <div className="text-zinc-300">Accounts.pdf</div>
          </div>
          <div className="text-center cursor-pointer grid gap-5">
            <Pdf />
            <div className="text-zinc-300">Accounts.pdf</div>
          </div>
        </div>

        {/* file upload button */}
        <div className="mt-10 text-center">
          <Button
            style={{
              backgroundColor: '#1565c0',
              borderRadius: '25px',
            }}
            component="label"
            variant="contained"
            startIcon={<IconCloudUpload />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
