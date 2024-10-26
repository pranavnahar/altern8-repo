import React, { useEffect, useState } from 'react';
import { RootFiClient } from 'rootfi-api';
import { RootFiEnvironment } from 'rootfi-api';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import { IntegrationCategory, IntegrationType } from 'rootfi-api/api';
import { useToast } from '../../utilities/show-toasts';
import { IconLoader } from '@tabler/icons-react';

type InviteLinkData = {
  data: {
    invite_link_id: string;
    rootfi_company_id?: string;
  };
};

declare global {
  interface Window {
    RootfiLink: {
      initialize: (config: {
        linkToken: string;
        onSuccess: () => void;
        onReady: () => void;
        onExit: () => void;
      }) => void;
      openLink: () => void;
      closeLink: () => void;
    };
  }
}

const ConnectSDK: React.FC<{
  integration: string;
  category: string;
  onEventChange: (s: string) => void;
}> = ({ integration, category, onEventChange }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let accessToken = parseCookies().altern8_useraccessForRegister;
  const { showToast } = useToast();

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  console.log(loadingSpinner);

  const [rootFiID, setRootFiID] = useState<string>();

  const SendRootfiRespToDB = async () => {
    // trim the fields before send
    let newRecord = {
      company_name: 'NAHAR',
      integration_type: category,
      company_id: rootFiID,
    };

    // submitting the data to backend
    try {
      // Set loading to true when starting the fetch
      setLoadingSpinner(true);

      let body = newRecord;
      console.log(body);
      let response = await fetch(`${apiUrl}/user-api/submit-rootfi-company-id/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify(body),
      });

      if (response.ok) {
        await response.json();
      } else {
        let server_error = await response.json();
        showToast({message : `${server_error}`,type:'error'})
      }
    } catch (error) {
      showToast({
        message: 'Failed to send otp, system error',
        type: 'error'
      });
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

  const [inviteLinkId, setInviteLinkId] = useState('');
  const [isReady, setIsReady] = useState(false);
  console.log(isReady);

  const [isLoading, setLoading] = useState(false);

  async function createLink() {
    try {
      const data: InviteLinkData = await rootfi.core.inviteLinks.create({
        company_name: 'NAHAR', //pending for an company name fetch
        integration_categories: [category as IntegrationCategory],
        integrations: [integration as IntegrationType],
      });
      setInviteLinkId(data.data.invite_link_id);
      //console.log(data.data)
      setRootFiID(data.data.rootfi_company_id);
      setIsReady(true);
    } catch (e) {
      showToast({message : `${e}`,type:'error'})
      console.log('error: ' + e);
    }
  }

  const RootfiLink = window.RootfiLink;
  async function loadRootFi() {
    RootfiLink.initialize({
      linkToken: inviteLinkId, // invite_link_id returned from Create Invite Link API
      onSuccess: () => {
        // connection succeeded
        RootfiLink.closeLink(); // Close the SDK
        alert('Connection Success');
        onEventChange('success');
        SendRootfiRespToDB();
        // Make an API call to save success status to your db
      },
      onReady: () => {
        // Open SDK when ready. You can open on a button Click.
        RootfiLink.openLink();
      },
      onExit: () => {
        // Close SDK when user clicks closed.
        RootfiLink.closeLink();
        onEventChange('incomplete');
        // Or you can show an alert msg instead of closing iframe
        alert('Please complete the setup');
      },
    });
  }

  useEffect(() => {
    if (inviteLinkId) {
      loadRootFi();
      setLoading(false);
    }
  }, [inviteLinkId]);

  function handleSubmit() {
    setLoading(true);
    createLink();
  }

  return (
    <div className="flex flex-col items-center justify-center mx-6">
      <button onClick={handleSubmit}>
        <div
          className={`h-14 w-14 overflow-hidden rounded-full relative ${
            isLoading ? 'bg-black' : 'bg-white'
          }`}
        >
          {!isLoading ? (
            <Image
              src={logoUrl}
              alt="Open RootFi SDK"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          ) : (
            <div className="flex items-center justify-center">
              <IconLoader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </button>
      <p className="my-4 mt-1 text-sm text-white">{integration}</p>
    </div>
  );
};

export default ConnectSDK;
