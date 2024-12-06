import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  // callback: Function
  callback: (event: Event) => void
) => {
  useEffect(() => {
    // const listener = (event: any) => {
    //   if (!ref.current || ref.current.contains(event.target)) {
    //     return;
    //   }
    //   callback(event);
    // };

    const listener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event); 
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
