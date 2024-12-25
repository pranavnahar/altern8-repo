'use client';

import React, { useRef, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { IconChevronRight, IconDownload, IconUpload } from '@tabler/icons-react';
import { sendInvite, uploadBulkInvites, getReferralLink, type ActionState } from './actions';
import { useToast } from '../../../utils/show-toasts';
import { Input } from '../../../components/ui/input';
import CustomSnippet from './_components/custom-snippet';

const Page = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [referralLink, setReferralLink] = useState('');

  const onSendInvite = async (data: FieldValues) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const result = await sendInvite(null, formData);
      if (result?.status === 'success') {
        showToast({
          message: result.message,
          type: 'success',
        });
        reset();
      } else {
        showToast({
          message: result?.message || 'An error occurred',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        message: 'An error occurred',
        type: 'error',
      });
    }
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showToast({
        message: 'Please select a file before uploading.',
        type: 'warning',
      });
      return;
    }

    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension!)) {
      showToast({
        message: 'Please upload a valid Excel file (.xlsx or .xls)',
        type: 'warning',
      });
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      showToast({
        message: 'File size should be less than 2 MB',
        type: 'warning',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const result = await uploadBulkInvites(null, formData);
      if (result?.status === 'success') {
        showToast({
          message: result.message,
          type: 'success',
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the file input
        }
      } else {
        showToast({
          message: result?.message || 'An error occurred during upload',
          type: 'error',
        });
      }
    } catch (error) {
      showToast({
        message: 'An error occurred during upload',
        type: 'error',
      });
    }
  };

  // Fetch referral link on component mount
  React.useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        const result = await getReferralLink();
        setReferralLink(result.referralLink);
      } catch (error) {
        console.error('Failed to fetch referral link');
      }
    };
    fetchReferralLink();
  }, []);

  return (
    <div className="min-h-screen mt-10 text-xl font-semibold text-center">
      <div className="w-4/5 mx-auto">
        <h1 className="py-5 text-3xl text-white font-medium tracking-tight text-center">
          Invite other borrowers
        </h1>

        <div className="flex-1 w-3/5 mx-auto pt-12">
          <p className="text-sm text-gray-300/65 mb-4 text-left font-normal">
            Share this referral code to invite people to Altern8.
          </p>
          <CustomSnippet>{referralLink}</CustomSnippet>
          <div className="flex items-center justify-center my-10">
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400/0 via-gray-400/50 to-gray-400/0"></div>
            <span className="px-4 text-gray-300 font-medium text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400/0 via-gray-400/50 to-gray-400/0"></div>
          </div>

          <p className="text-sm text-gray-300/65 mb-4 text-left font-normal">
            Enter the email address of the person you want to invite.
          </p>
          <form onSubmit={handleSubmit(onSendInvite)} className="flex items-center gap-2">
            <div className="flex-1">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="Email"
                className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b text-sm placeholder:font-normal duration-300 ease-in-out outline-none focus:border-purple-600"
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
              )}
            </div>
            <Button
              variant="expandIcon"
              size="sm"
              iconPlacement="right"
              Icon={IconChevronRight}
              type="submit"
              className="text-sm max-w-max text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            >
              Send Invite
            </Button>
          </form>
        </div>

        <div className="w-3/5 mx-auto pt-12">
          <p className="text-sm text-gray-300/65 mb-4 text-left font-normal">
            To send bulk invites, download the template below, fill in the emails, and then upload
            it.
          </p>
          <div className="flex gap-5">
            <Button
              variant="expandIcon"
              size="sm"
              iconPlacement="right"
              Icon={IconDownload}
              type="button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'bulk_email_template/bulk-email-template.xlsx';
                link.download = 'bulk_email_template.xlsx';
                link.click();
              }}
              className="text-sm max-w-max text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            >
              Download Template
            </Button>

            <div
              className={`relative flex-1 ${
                selectedFile ? 'border-violet-600' : 'border-neutral-300/70'
              } w-full py-2 pl-5 font-normal text-sm text-left truncate border rounded-md`}
            >
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelection}
                id="upload-excel-file"
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-neutral-200">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </div>
            </div>

            <Button
              variant="expandIcon"
              size="sm"
              iconPlacement="right"
              Icon={IconUpload}
              type="button"
              onClick={handleFileUpload}
              className="text-sm text-white max-w-max h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            >
              Upload Bulk Invites
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
