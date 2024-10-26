import BasicTableSkeleton from "@/components/global/basic-table-skeleton";
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
    <Suspense fallback={<BasicTableSkeleton />}>
      <main className="ledger-main px-10 pt-20" id="ledger-main-page">
        {children}
      </main>
    </Suspense>
  );
}
