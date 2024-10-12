import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 RERA",
  description: "RERA template",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="rera-main" id="rera-main-page">
      {children}
    </main>
  );
}
