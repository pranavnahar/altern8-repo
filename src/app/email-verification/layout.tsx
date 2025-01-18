import LoadingSpinner from "@/components/LoadingSpinner";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Altern8 | Email Verification",
  description: "Email Verfication POC's",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="email-verification-main" id="email-verification-page">
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </main>
  );
}
