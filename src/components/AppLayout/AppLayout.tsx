"use client";
import React, { ReactNode } from "react";
import Header from "../Header/Header";
import { RecoilRoot } from "recoil";
import { usePathname } from "next/navigation";
import { Toaster } from "../ui/toaster";

type LayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathName = usePathname();
  return (
    <RecoilRoot>
      <div className="[background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] min-h-[100vh]">
        {pathName !== "/login" && pathName !== "/register" ? <Header /> : null}
        {children}
        <Toaster />
      </div>
    </RecoilRoot>
  );
};

export default AppLayout;
