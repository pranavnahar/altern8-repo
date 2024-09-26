import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Upload File",
  description: "Upload file",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="upload-main" id="upload-main-page">
      {children}
    </main>
  );
}
