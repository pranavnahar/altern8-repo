/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { ReactNode, useState,useEffect } from "react";
import { RecoilRoot } from "recoil";
import { usePathname } from "next/navigation";
import SideBar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { Toaster } from "../ui/toaster";

type LayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathName = usePathname();

  // Sidebar state for toggle and current page selection
  const [toggle, setToggle] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setToggle(false);
    }
  };

  const handleMouseLeave = () => {
    setToggle(true);
  };

  useEffect(() => {
    setToggle(window.innerWidth < 1024);
  }, []);

  return (
    <RecoilRoot>
      <div className="[background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] min-h-[100vh] flex">
        {/* Sidebar */}
        {pathName !== "/login" && pathName !== "/register" && (
          <div
            className={`transition-all duration-300 ${
              toggle ? "w-16" : "w-64"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SideBar
              currentPath={pathName}
              toggle={toggle}
              setToggle={setToggle}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        {/* Main content area */}
        <div className={`flex-1 flex flex-col ${toggle ? "ml-5" : "ml-24"}`}>
          {/* Render the Header, ensuring it's below the sidebar */}
          {pathName !== "/login" && pathName !== "/register" ? (
            <div className="sticky top-0 z-10">
              <Header />
            </div>
          ) : null}

          {/* Main content passed as children */}
          <main className="flex-1 p-4">{children}</main>

          {/* Toaster for notifications */}
          <Toaster />
        </div>
      </div>
    </RecoilRoot>
  );
};

export default AppLayout;
