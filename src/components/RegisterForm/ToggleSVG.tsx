import { authSVGProps } from "@/Types/types";
import React from "react";

const ToggleSVG: React.FC<authSVGProps> = ({
  showPassword,
  setShowPassword,
}) => {
  return (
    <>
      {showPassword && (
        <svg
          className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          aria-hidden="true"
          onClick={() => setShowPassword(!showPassword)}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M5 7.8C6.7 6.3 9.2 5 12 5s5.3 1.3 7 2.8a12.7 12.7 0 0 1 2.7 3.2c.2.2.3.6.3 1s-.1.8-.3 1a2 2 0 0 1-.6 1 12.7 12.7 0 0 1-9.1 5c-2.8 0-5.3-1.3-7-2.8A12.7 12.7 0 0 1 2.3 13c-.2-.2-.3-.6-.3-1s.1-.8.3-1c.1-.4.3-.7.6-1 .5-.7 1.2-1.5 2.1-2.2Zm7 7.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clip-rule="evenodd"
          />
        </svg>
      )}

      {!showPassword && (
        <svg
          className="w-6 h-6 absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          aria-hidden="true"
          onClick={() => setShowPassword(!showPassword)}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="m4 15.6 3-3V12a5 5 0 0 1 5-5h.5l1.8-1.7A9 9 0 0 0 12 5C6.6 5 2 10.3 2 12c.3 1.4 1 2.7 2 3.6Z" />
          <path d="m14.7 10.7 5-5a1 1 0 1 0-1.4-1.4l-5 5A3 3 0 0 0 9 12.7l.2.6-5 5a1 1 0 1 0 1.4 1.4l5-5 .6.2a3 3 0 0 0 3.6-3.6 3 3 0 0 0-.2-.6Z" />
          <path d="M19.8 8.6 17 11.5a5 5 0 0 1-5.6 5.5l-1.7 1.8 2.3.2c6.5 0 10-5.2 10-7 0-1.2-1.6-2.9-2.2-3.4Z" />
        </svg>
      )}
    </>
  );
};

export default ToggleSVG;
