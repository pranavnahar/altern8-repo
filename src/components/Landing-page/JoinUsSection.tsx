// Join us section for landing page
"use client"
import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Link from "next/link";

// main return function
const JoinUsSection = () => {
    // framer motion , animation on scroll
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            // fire the  animation
            mainControls.start({ x: [900, 0] });
        }
    }, [isInView]);

    return (
        <div
          ref={ref}
          className="container max-w-[1320px]  mx-auto mb-32 mt-32 text-center text-xl sm:text-10xl lg:text-20xl text-gray-300"
        >
          <div className="relative box-border mx-7 h-[3px] border-t-[3px] border-solid border-white-font" />
    
          {/* animation  */}
          <motion.div
            initial={{ x: +1000 }}
            // animate={{ x: [900, 0] }}
            animate={mainControls}
            transition={{ duration: 2, delay: 0.2 }}
            whileHover={{ scale: 0.97, opacity: 0.9 }}
            className="rounded-lg mx-7 px-2 my-20 h-[170px] sm:h-[240px] lg:h-[380px] bg-dark-purple  flex flex-col items-start justify-between relative  "
          >
            <div className="absolute my-0 mx-[!important] lg:w-[68.45%] top-[40px] sm:top-[30px] lg:top-[106px] lg:left-[31.55%] sm:left-[9.55%] tracking-[-0.5px] font-medium flex items-center justify-center z-[0]">
              Join us and never worry about your finances
            </div>
            <div className="hidden lg:inline absolute my-0 mx-[!important] lg:w-[68.29%] top-[162px] lg:left-[31.71%] text-xl tracking-[-0.5px] items-center justify-center z-[1] text-gray-400">
              Get instant working capital within 24-72 hrs and scale up your
              business
            </div>
    
            <img
              className="hidden lg:inline absolute my-0 mx-[!important] w-[30.98%] top-[17px] right-[68.42%] left-[2.6%] max-w-full overflow-hidden h-[350px] shrink-0 object-cover z-[2]"
              alt=""
              src="/image-427@2x.png"
            />
    
            {/* Get Credit button */}
            <div className="my-0 mx-[!important] absolute top-[30%] left-[23%] sm:top-[50%] sm:left-[30%] lg:w-[22.77%] lg:top-[226px] lg:right-[22.86%] lg:left-[54.37%] ">
              <Link
                href="/register"
                className="relative inline-flex items-center justify-center p-4 px-6 py-3 h-14 w-[200px] overflow-hidden font-medium text-white-font transition duration-300 ease-out border-0 border-[#1565c0] rounded-full  group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white-font duration-300 -translate-x-full bg-[#1565c0] group-hover:translate-x-0 ease">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full font-normal text-5xl sm:text-5xl text-white-font bg-[#1565c0] transition-all duration-300 transform group-hover:translate-x-full ease">
                  Get Credit
                </span>
                <span className="relative invisible">Get Credit</span>
              </Link>
            </div>
          </motion.div>
        </div>
      );
};

export default JoinUsSection;
