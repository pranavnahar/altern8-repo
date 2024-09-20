import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 reset password",
  description: "Reset Password",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="reset-main" id="reset-main-page">
      {children}
    </main>
  );
}
