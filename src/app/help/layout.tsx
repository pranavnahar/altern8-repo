import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Help page",
  description: "Help",
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
