import React, { ReactNode, Suspense } from 'react'
import Sidebar from './_components/sidebar'
import Navbar from './_components/navbar'
import { AuthProvider } from './_components/auth-context'
import AuthCheck from './_components/auth-check'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <AuthProvider>
      <AuthCheck>
        <Suspense>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar />
              {/* <Header /> */}
              <main className="flex-1 p-7 overflow-auto">{children}</main>
            </div>
          </div>
        </Suspense>
      </AuthCheck>
    </AuthProvider>
  )
}
