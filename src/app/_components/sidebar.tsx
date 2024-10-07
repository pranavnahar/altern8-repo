'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar as SidebarLayout, SidebarBody, SidebarLink } from '../../components/ui/sidebar';
import Link from 'next/link';
import {
  IconApiApp,
  IconLayoutDashboard,
  IconLogs,
  IconMoneybag,
  IconReceipt,
  IconReport,
  IconSettings,
  IconUserCircle,
  IconUsers,
  IconWallet,
} from '@tabler/icons-react';
import { Skeleton } from '@/components/ui/skeleton';

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const links = [
    {
      label: 'Auction',
      href: '/dashboard/auction',
      icon: (
        <IconLayoutDashboard className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />
      ),
      roles: ['admin', 'user', 'superadmin'],
    },
    {
      label: 'Contracts',
      href: '/dashboard/contracts',
      icon: <IconReceipt className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'superadmin'],
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      icon: <IconUsers className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'superadmin'],
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <IconUserCircle className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'user', 'superadmin'],
    },
    {
      label: 'Ledger',
      href: '/dashboard/ledger',
      icon: <IconWallet className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'superadmin', 'user'],
    },
    {
      label: 'Logs',
      href: '/dashboard/logs',
      icon: <IconLogs className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['superadmin'],
    },
    {
      label: 'Reports',
      href: '/dashboard/reports',
      icon: <IconReport className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'user', 'superadmin'],
    },
    {
      label: 'API Management',
      href: '/dashboard/api-management',
      icon: <IconApiApp className="flex-shrink-0 size-5 text-zinc-200" strokeWidth={1.75} />,
      roles: ['admin', 'superadmin'],
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
        <div></div>
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
      <h1 className="text-xl">ETHYX</h1>
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
