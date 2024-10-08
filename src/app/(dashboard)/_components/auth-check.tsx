'use client'

import React, { ReactNode, useEffect } from 'react'
import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'

type Props = {
  children: ReactNode
}

const AuthCheck = ({ children }: Props) => {
  const { checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login')
    }
  }, [checkAuth, router])

  return <>{children}</>
}

export default AuthCheck
