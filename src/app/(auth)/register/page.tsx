"use client";

import Register from "../../../components/RegisterForm/Register";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Enter") {
        const url = new URL(window.location.href);
        url.searchParams.set("demo", "true");
        window.history.pushState({}, "", url);
        setIsDemo(true);
      }
    };

    setIsDemo(searchParams.get("demo") === "true");

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchParams]);

  return (
    <div>
      <Register demo={isDemo} />
    </div>
  );
};

export default Page;
