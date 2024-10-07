import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Login",
  description: "Login to enter",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="login-main" id="login-main-page">
      {children}
    </main>
  );
}
