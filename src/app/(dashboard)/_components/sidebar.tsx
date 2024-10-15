'use client';

import { useEffect, useState } from 'react';
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
import AnimatedLogo from '@/components/Header/AnimatedLogo';

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

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
                className={`px-2 ${
                  pathname === link.href
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
              label: 'Chikorita',
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
