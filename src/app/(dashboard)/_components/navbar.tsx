'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export const Navbar: FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="shadow-lg bg-white/10 z-20 backdrop-blur-md">
      <div className="px-4 mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white"></Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 card-cover rounded-full dark:bg-gray-700 focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconUserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300 card-cover" />
              </motion.button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-50 overflow-hidden rounded-lg shadow-md p-5 min-w-max top-16 bg-zinc-200/90 backdrop-blur-md"
                  >
                    <div className="flex items-center">
                      <div className="grid gap-3">
                        <div className="flex">
                          <img
                            src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yYVU0VUpvY3hEQkk5Z2JiSzZzcGtGcEhBTmwifQ?width=80"
                            alt="Profile Picture"
                            className="top-0 mb-auto mr-5 rounded-full size-10"
                          />
                          <div>
                            <h2 className="text-lg font-medium">Anurag Das</h2>
                            <p className="text-sm font-medium text-zinc-500 -mt-1">oeuvars</p>
                          </div>
                        </div>
                        <Separator className="opacity-70" />
                        <Link href="/developer-entry" className="w">
                          <Button
                            size="sm"
                            className="text-xs text-white w-full"
                            //variant="expandIcon"
                            //Icon={IconLogout}
                            //iconPlacement="right"
                          >
                            Sign Out
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
