import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Altern8 Register",
  description: "Register to login",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="register-main" id="register-main-page">
      {children}
    </main>
  );
}
