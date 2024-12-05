'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode, FC } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { checkAuthServer } from '@/utils/auth-actions'

interface AuthContextType {
  isAuthenticated: boolean
  checkAuth: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    const isAuthServer = await checkAuthServer()
    console.log("boolean", isAuthServer)
    setIsAuthenticated(isAuthServer)
    if (!isAuthServer && pathname !== '/login') {
      setShowLoginModal(true)
    }
    return isAuthServer
  }

  useEffect(() => {
    checkAuth();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth()
      }
    }

    const handleOnline = () => {
      checkAuth()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
    }
  }, [checkAuth])

  const logout = () => {
    setIsAuthenticated(false)
    router.push('/login')
  }

  const handleLoginRedirect = () => {
    setShowLoginModal(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
      {children}
      <Dialog open={showLoginModal}>
        <DialogContent className="flex flex-col gap-10 background border-none">
          <DialogHeader className="">
            <DialogTitle className="text-lg font-medium text-center text-white">Login Expired</DialogTitle>
            <DialogDescription className="text-center mt-2 text-zinc-500">
              You need to re-log in to access this page.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleLoginRedirect} className="mt-4 w-full">
            Go to Login
          </Button>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
