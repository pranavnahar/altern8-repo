import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 | Email Verification",
  description: "Email Verfication POC's",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="" >
      {children}
    </main>
  );
}
