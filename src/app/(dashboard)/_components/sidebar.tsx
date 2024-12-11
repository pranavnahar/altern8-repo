'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from 'next/navigation';
import { Sidebar as SidebarLayout, SidebarBody, SidebarLink } from '../../../components/ui/sidebar';
import Link from 'next/link';
import {
  IconApiApp,
  IconBuildingBank,
  IconCalendar,
  IconCloudUpload,
  IconHelp,
  IconLayoutDashboard,
  IconLogs,
  IconMoneybag,
  IconReceipt,
  IconReport,
  IconScreenShare,
  IconSettings,
  IconUserCircle,
  IconUsers,
  IconWallet,
} from '@tabler/icons-react';
import AnimatedLogo from '../../../components/Header/AnimatedLogo';
import { jwtDecode } from 'jwt-decode';
import { parseCookies } from 'nookies';
import { getAccessToken } from '@/utils/auth';

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [uId, setUId] = useState<string>('Loading..');
  const [username, setUsername] = useState<string>('Loading..');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  let accessToken = parseCookies().altern8_useraccess;

  // Replace or refresh token logic
  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push("/login"); 
    } else {
      accessToken = token;
    }
  };

  const links = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <IconLayoutDashboard className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />
      ),
    },
    {
      label: 'Company Details',
      href: '/company-details',
      icon: <IconBuildingBank className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Calendar',
      href: '/calendar',
      icon: <IconCalendar className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Projects List',
      href: '/projects',
      icon: <IconReceipt className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Ledger',
      href: '/ledger',
      icon: <IconWallet className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Referral',
      href: '/referral',
      icon: <IconScreenShare className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Upload Files',
      href: '/upload-files',
      icon: <IconCloudUpload className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
    {
      label: 'Help',
      href: '/help',
      icon: <IconHelp className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
    },
  ];

  useEffect(() => {
    // const fetchTokenAndSetUserId = async () => {
    //   try {
    //     const accessToken = parseCookies().altern8_useraccess;
    //     const token = accessToken;

    //     if (token) {
    //       const decodedToken: { uid: string } = jwtDecode(token);
    //       // console.log(decodedToken, "-------------------");
    //       const userId = decodedToken.uid;
    //       await new Promise(resolve => setTimeout(resolve, 1000));
    //       setUId(userId);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const fetchUsernameAndUid = async () => {
      try {
        if (!accessToken) {
          await ReplaceTokenOrRedirect();
        }
  
        let response = await fetch(`${apiUrl}/user-dashboard-api/get-uid/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.status === 401) {
          // Handle token expiry
          await ReplaceTokenOrRedirect();
          response = await fetch(`${apiUrl}/user-dashboard-api/get-uid/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }
  
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user_data.name);
          setUId(data.user_data.uid)
        } else {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
      } catch (err: any) {
        console.error("Error fetching username data:", err);
      }
    }

    fetchUsernameAndUid();
  }, []);

  return (
    <SidebarLayout open={open} setOpen={setOpen}>
      <SidebarBody className="flex flex-col justify-between h-full shadow-2xl bg-white/10 backdrop-blur-md z-20">
        <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="flex flex-col gap-2 mt-8">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={{
                  ...link,
                }}
                className={`px-2 ${pathname === link.href
                    ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg'
                    : ''
                  }`}
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: `${username}\n${uId}`,
              href: '/profile',
              icon: (
                <IconUserCircle className="flex-shrink-0 size-6 text-zinc-200" strokeWidth={1.5} />
              ),
            }}
            className={`px-2`}
          />
        </div>
      </SidebarBody>
    </SidebarLayout>
  );
};

const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center text-sm font-normal text-zinc-50 mr-auto ml-1.5 gap-2"
    >
      <IconSettings className="size-7 text-zinc-200" strokeWidth={1.5} />
      <h1 className="text-xl">
        <AnimatedLogo />
      </h1>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link href="/" className="relative z-20 flex items-center font-normal text-zinc-50 ml-1.5">
      <IconSettings className="size-7 text-zinc-200" strokeWidth={1.5} />
    </Link>
  );
};

export default Sidebar;
