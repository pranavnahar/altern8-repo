'use client'

import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'

type Props = {
  children: ReactNode
}

const AuthCheck = ({ children }: Props) => {
  const { checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/')
    }
  }, [checkAuth, router])

  return <>{children}</>
}

export default AuthCheck
