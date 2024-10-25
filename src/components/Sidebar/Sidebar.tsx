"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, UserRound } from "lucide-react";
import { menuItemsLogos } from "../global/menu-items";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

interface SideBarProps {
  currentPath: string;
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>; // Added setToggle to the props
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const SideBar: React.FC<SideBarProps> = ({
  setCurrentPage,
  currentPath,
  toggle,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const [adminData, setAdminData] = useState<{
    name: string;
    uid: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const cookies = parseCookies();
  const accessToken = cookies.altern8_useraccess;

  if (!accessToken) {
    router.push('/login')
    return;
  }

  const fetchAdminData = async () => {

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user-dashboard-api/get-uid/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "*/*",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAdminData({ name: data.name, uid: data.uid });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch admin data");
      }
    } catch (error) {
      setErrorMessage("An error occurred while fetching admin data");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);


  const MenuItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Company Details", link: "/company-details"},
    { name: "Calendar", link: "/calendar" },
    { name: "Projects List", link: "/projects-list" },
    { name: "Ledger", link: "/ledger" },
    { name: "Referral", link: "/referral" },
    { name: "Upload Files", link: "/upload-files" },
    { name: "Help", link: "/help"},
  ];

  useEffect(() => {
    const index = MenuItems.findIndex((item) =>
      item.link === "/"
        ? currentPath === "/"
        : currentPath.startsWith(item.link)
    );
    if (index !== -1) {
      setCurrentPage(index + 1);
    }
  }, [currentPath, setCurrentPage, MenuItems]);

  const renderMenuItem = (
    item: { name: string; link: string },
    index: number
  ) => {
    const isActive =
      item.link === "/"
        ? currentPath === "/"
        : currentPath.startsWith(item.link);

    return (
      <Link
        key={index}
        href={item.link}
        className={`flex gap-2 items-center py-2 pl-3 mb-2 cursor-pointer rounded-lg animation ${
          isActive
            ? "bg-primary text-zinc-200"
            : "text-zinc-400 hover:bg-primary/90 hover:text-gray-200"
        }`}
      >
        <span>{menuItemsLogos[index]}</span>
        <div
          className={`mr-4 text-sm truncate ${
            toggle ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
        >
          {item.name}
        </div>
        {!toggle && (
          <div className="ml-auto mr-1">
            <ChevronRight className="my-auto size-5" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`z-20 fixed ${
        toggle ? "w-16" : "w-[17%]"
      } transition-all duration-500 ease-in-out transform`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="top-0 left-0 flex flex-col overflow-hidden user-select-none rounded-r-md h-screen [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        <div className="flex flex-col h-full mx-1 lg:mx-2 xl:mx-3">
          <div
            className={`relative flex pt-5 pb-3 mx-auto text-center text-gray-200 lg:text-base xl:text-lg 2xl:text-xl text-nowrap font-semibold text-xl ${
              toggle
                ? "opacity-0 truncate"
                : "opacity-100 transition-opacity duration-500 delay-300 cursor-pointer"
            } pl-1 xl:pl-2 cursor-pointer`}
          >
            ALTERN8 ADMIN
          </div>

          <div className="flex-1 ">{MenuItems.map(renderMenuItem)}</div>

          <div
            className={`flex items-center py-2 pl-2 mt-5 mb-4 text-gray-200 rounded-lg hover:text-gray-200`}
          >
            <div className="mr-2">
              <UserRound className="my-auto size-6" />
            </div>
            <div
              className={`flex-col ${
                toggle
                  ? "opacity-0"
                  : "opacity-100 transition-opacity duration-300 delay-300"
              }`}
            >
              {adminData ? (
                <>
                  <div className="mr-4 text-base font-medium">
                    {adminData.name}
                  </div>
                  <div className="mr-4 text-[12px] text-gray-300">
                    ID-{adminData.uid}
                  </div>
                </>
              ) : (
                <div className="mr-4 text-base font-medium"></div>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-xs mt-2">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
