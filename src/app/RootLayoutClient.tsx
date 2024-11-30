"use client";

import { Toaster } from 'sonner';
import { RecoilRoot } from 'recoil';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      {children}
      <Toaster position="bottom-center" />
    </RecoilRoot>
  );
}
