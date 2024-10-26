'use client';

import React, { useRef, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '../../../components/ui/button';
import { IconChevronRight, IconUpload } from '@tabler/icons-react';
import { Snippet } from '@nextui-org/snippet';
import { sendInvite, uploadBulkInvites, getReferralLink, type ActionState } from './actions';
import { useToast } from '../../../utilities/show-toasts';
import { Input } from '../../../components/ui/input';

const Page = () => {
  const [inviteState, inviteAction] = useFormState<ActionState, FormData>(sendInvite, null);
  const [uploadState, uploadAction] = useFormState<ActionState, FormData>(uploadBulkInvites, null);
  const [referralLinkState, getReferralLinkAction] = useFormState(getReferralLink, {
    referralLink: '',
  });
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getReferralLinkAction();
  }, []);

  useEffect(() => {
    if (inviteState?.status === 'success') {
      showToast({
        message: inviteState.message,
        type: 'success'
      });
    } else if (inviteState?.status === 'error') {
      showToast({
        message: inviteState.message,
        type: 'error'
      });
    }
  }, [inviteState, showToast]);

  useEffect(() => {
    if (uploadState?.status === 'success') {
      showToast({
        message: uploadState.message,
        type: 'success'
      });
    } else if (uploadState?.status === 'error') {
      showToast({
        message: uploadState.message,
        type: 'error'
      });
    }
  }, [uploadState, showToast]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension!)) {
      showToast({
        message: 'Please upload a valid Excel file (.xlsx or .xls)',
        type: 'warning'
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        message: 'File size should be less than 2 MB',
        type: 'warning'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    await uploadAction(formData);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen mt-10 text-xl font-semibold text-center">
      <div className="w-4/5 mx-auto">
        <h1 className="py-5 text-3xl text-white font-medium tracking-tight text-center">
        Invite other borrowers
        </h1>
        <div className="flex-1 w-3/5 mx-auto pt-12">
          <Snippet
            symbol={false}
            variant="solid"
            color="primary"
            className="bg-white/10 text-white w-full rounded-lg text-sm px-5"
          >
            {referralLinkState.referralLink}
          </Snippet>
          <h1 className="py-10 text-xl text-white font-medium tracking-tight text-center">Or</h1>
          <form action={inviteAction} className="flex gap-5">
            <input
              name="email"
              placeholder="Email"
              className="w-full py-1 text-gray-100 transition-colors bg-transparent border-b text-sm placeholder:font-normal duration-300 ease-in-out outline-none focus:border-purple-600"
              type="email"
              required
            />
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

        <div className="flex w-3/5 gap-5 mx-auto pt-12">
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            id="upload-excel-file"
            ref={fileInputRef}
            className="w-full  transition-colors bg-transparent border border-dashed rounded-md outline-none appearance-none cursor-pointer focus:outline-none focus:border-purple-600 text-neutral-200 border-neutral-300/70 placeholder:text-neutral-100 hover:bg-neutral-950/20 animation"
          />
          <label htmlFor="upload-excel-file">
            <Button
              variant="expandIcon"
              size="sm"
              iconPlacement="right"
              Icon={IconUpload}
              type="button"
              className="text-sm text-white max-w-max h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            >
              Upload Bulk Invites
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Page;
