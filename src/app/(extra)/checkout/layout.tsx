import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Altern8 Checkout page",
  description: "Checkout",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={'loading'}>
        <main className="help-main" id="help-main-page">
      {children}
    </main>
    </Suspense>
  );
}
