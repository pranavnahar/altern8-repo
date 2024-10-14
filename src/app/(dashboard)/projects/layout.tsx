import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Altern8 Project',
  description: 'Ledger Project',
};

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>loading</div>}>
      <main className="ledger-main" id="ledger-main-page">
        {children}
      </main>
    </Suspense>
  );
}
