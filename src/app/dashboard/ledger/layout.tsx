import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Altern8 Ledger user",
  description: "Ledger User",
};

export default function ProductLayout({
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
