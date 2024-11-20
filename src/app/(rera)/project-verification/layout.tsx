import type { Metadata } from "next";
import { Toaster } from "sonner";

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
