'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import nookies from 'nookies';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthContextType {
  isAuthenticated: boolean;
  checkAuth: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = () => {
    const cookies = nookies.get(null);
    const accessToken = cookies.altern8_useraccess;
    const refreshToken = cookies.altern8_userrefresh;
    const isAuth = !!(accessToken && refreshToken);
    setIsAuthenticated(isAuth);
    if (!isAuth && pathname !== '/login') {
      setShowLoginModal(true);
    }
    return isAuth;
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 5000);
    return () => clearInterval(interval);
  }, [pathname]);

  const logout = () => {
    nookies.destroy(null, 'altern8_useraccess');
    nookies.destroy(null, 'altern8_userrefresh');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
      {children}
      <Dialog open={showLoginModal}>
        <DialogContent className="flex flex-col gap-10">
          <DialogHeader className="">
            <DialogTitle className="text-lg font-medium text-center">Login Expired</DialogTitle>
            <DialogDescription className="text-center mt-2">
              You need to re-log in to access this page.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleLoginRedirect} className="mt-4 w-full">
            Go to Login
          </Button>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
