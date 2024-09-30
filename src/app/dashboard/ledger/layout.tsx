import type { Metadata } from "next";

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
    <main className="ledger-main" id="ledger-main-page">
      {children}
    </main>
  );
}
