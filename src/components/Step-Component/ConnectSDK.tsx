'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { RootFiClient, RootFiEnvironment } from 'rootfi-api';
import Image from 'next/image';
import { useToast } from '../../utils/show-toasts';
import { Loader2 } from 'lucide-react';
import { getAuthToken } from '@/utils/auth-actions';

interface InviteLinkData {
  data: {
    invite_link_id: string;
    rootfi_company_id?: string; // Optional property
  };
}

declare global {
  interface Window {
    RootfiLink: any;
  }
}

const ConnectSDK: React.FC<{ integration: any; category: any; onEventChange: any }> = ({ integration, category, onEventChange }) => {
  const { showToast } = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [rootFiID, setRootFiID] = useState<string | null>(null);
  const [inviteLinkId, setInviteLinkId] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const SendRootfiRespToDB = async () => {
    let newRecord = {
      company_name: 'NAHAR',
      integration_type: category,
      company_id: rootFiID,
    };

    try {
      const token = await getAuthToken()
      setLoadingSpinner(true);
      let response = await fetch(`${apiUrl}/user-dashboard-api/submit-rootfi-company-id/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        let data = await response.json();
        console.log('Rootfi ID successfully saved');
      } else {
        let server_error = await response.json();
        console.error('Failed to upload accounting data details', server_error);
      }
    } catch (error) {
      console.error('Server Connection Error updating accounting data:', error);
      showToast({ message: 'Failed to send otp, system error duration', type: 'error' });
    } finally {
      setLoadingSpinner(false);
    }
  };

  let logoUrl;
  switch (category) {
    case 'ECOMMERCE':
      logoUrl = `/Ecommerce_Register_Logos/${integration}.png`;
      break;
    case 'ACCOUNTING':
      logoUrl = `/Accounting_Register_Logos/${integration}.png`;
      break;
    case 'PAYMENTS':
      logoUrl = `/Pos_platform_logos/${integration}.png`;
      break;
    case 'OTHERS':
      logoUrl = `/others.svg`;
      break;
    default:
      logoUrl = '';
  }

  const rootfi = new RootFiClient({
    apiKey: process.env.NEXT_PUBLIC_ROOTFI_API_KEY!,
    environment: RootFiEnvironment.Global,
  });

  async function createLink() {
    try {
      const data: InviteLinkData = await rootfi.core.inviteLinks.create({
        company_name: 'NAHAR',
        integration_categories: [category],
        integrations: [integration],
      });
      setInviteLinkId(data.data.invite_link_id);
      setRootFiID(data.data.rootfi_company_id ?? null);
      setIsReady(true);
    } catch (e) {
      console.log('error: ' + e);
    }
  }

  async function loadRootFi() {
    const { RootfiLink } = window;
    if (RootfiLink) {
      console.log('Initializing RootFiLink with linkToken:', inviteLinkId);
      RootfiLink.initialize({
        linkToken: inviteLinkId,
        onSuccess: () => {
          RootfiLink.closeLink();
          alert('Connection Success');
          onEventChange('success');
          SendRootfiRespToDB();
        },
        onReady: () => {
          console.log('RootFiLink is ready, opening link...');
          RootfiLink.openLink();
        },
        onExit: () => {
          RootfiLink.closeLink();
          onEventChange('incomplete');
          alert('Please complete the setup');
        },
      });
    } else {
      console.error('RootfiLink is not defined on the window object.');
    }
  }

  useEffect(() => {
    if (window.RootfiLink && inviteLinkId) {
      loadRootFi();
      setLoading(false);
    }
  }, [inviteLinkId]);

  function handleSubmit() {
    setLoading(true);
    createLink();
  }

  return (
    <>
      <Script src="https://app.rootfi.dev/sdk.js" type="text/javascript"/>
      <div className="flex flex-col items-center justify-center mx-6">
        <button onClick={handleSubmit}>
          <div className={`h-14 w-14 overflow-hidden rounded-full relative ${isLoading ? 'bg-black' : 'bg-white'}`}>
            {!isLoading ? (
              <Image src={logoUrl} alt="Open RootFi SDK" objectFit="contain" className="rounded-full" width={100} height={500} />
            ) : (
              <Loader2 className='size-6 animate-spin my-auto'/>
            )}
          </div>
        </button>
        <p className="my-4 mt-1 text-sm text-white">{integration}</p>
      </div>
    </>
  );
};

export default ConnectSDK;
