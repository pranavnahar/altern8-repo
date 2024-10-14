/* eslint-disable @typescript-eslint/no-explicit-any */ // for now need to replace in future define type instead of any
import * as React from "react";
import { motion } from "framer-motion";

export interface ListProps {
  data: any[];
  keyToMap: any[];
  className?: string;
}

export default function List({
  data: listData,
  keyToMap,
  className,
}: ListProps) {
  return (
    <>
      {listData.map((data, index: number) => (
        <motion.div
          key={index}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
          className={`flex items-center justify-between w-[90%] p-1 border-b mx-auto border-b-[#bbb] text-sm ${className}`}
        >
          {keyToMap.map((mapValue, currentIndex: number) => (
            <p key={currentIndex}>{data[mapValue]}</p>
          ))}
        </motion.div>
      ))}
    </>
  );
}
