import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const AnimatedLogo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 1500); // Toggle every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  const router = useRouter()

  return (
    <div className=" self-center">
      <div
        className="[text-decoration:none] relative tracking-[6px] font-semibold text-5xl sm:text-21xl lg:text-10xl header_font font-exo"
        onClick={()=>{router.push('/')}}
      >
        <div className="flex items-center gap-1">
          <motion.img
            src="/images/Altern.png"
            alt="altern"
            className={`w-[120px]`}
          />
          <motion.img
            src={isVisible ? "/images/8.png" : "/images/infinity.png"}
            alt="Altern8"
            className={`w-[50px] h-[45px] object-contain  ${
              isVisible ? "none" : "block"
            }`}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
