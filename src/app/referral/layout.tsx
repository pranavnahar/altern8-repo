import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Referral",
  description: "Refferal",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="referral-main" id="referral-main-page">
      {children}
    </main>
  );
}
