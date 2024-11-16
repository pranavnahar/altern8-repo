// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// const AnimatedLogo: React.FC = () => {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsVisible((prev) => !prev);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const router = useRouter()

//   return (
//     <div className=" self-center">
//       <div
//         className="[text-decoration:none] relative tracking-[6px] font-semibold text-5xl sm:text-21xl lg:text-10xl header_font font-exo"
//         onClick={()=>{router.push('/')}}
//       >
//         <div className="flex items-center gap-1">
//           <motion.img
//             src="/images/Altern.png"
//             alt="altern"
//             className={`w-[120px]`}
//           />
//           <motion.img
//             src={isVisible ? "/images/8.png" : "/images/infinity.png"}
//             alt="Altern8"
//             className={`w-[50px] h-[45px] object-contain  ${
//               isVisible ? "none" : "block"
//             }`}
//             transition={{ duration: 0.10 }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnimatedLogo;

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AnimatedLogo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  return (
    <div className="self-center">
      <div
        className="[text-decoration:none] relative tracking-[6px] font-semibold text-5xl sm:text-21xl lg:text-10xl header_font font-exo"
        onClick={() => {
          router.push('/');
        }}
      >
        <div className="flex items-center gap-1">
          <motion.img
            src="/images/Altern.png"
            alt="altern"
            className="w-[120px]"
            // animate={{ rotate: 360 }}
            // transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />
          {/* <motion.img
            src={isVisible ? "/images/8.png" : "/images/infinity.png"}
            alt="Altern8"
            className={`w-[50px] h-[45px] object-contain ${
              isVisible ? "none" : "block"
            }`}
            // transition={{ duration: 0.10 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          /> */}
          <motion.img
            // src={isVisible ? '/images/8.png' : '/images/infinity.png'}
             src={'/images/infinity.png'}
            alt="Altern8"
            className={`w-[50px] h-[45px] object-contain ${isVisible ? 'none' : 'block'}`}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 5, // Longer duration for a smoother, slower effect
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogo;
