import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Dashboard help",
  description: "Dashboard help",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="help-main" id="help-main-page">
      {children}
    </main>
  );
}
