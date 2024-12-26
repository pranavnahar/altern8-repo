"use client"

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { advisors } from '../../../data/advisors';

interface Advisor {
  first_name: string;
  last_name?: string;
  image: string;
  role: string;
  country: string;
  url: string;
}

const AdvisorsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  // State to track hover index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  const handleDivClick = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="overflow-y-hidden">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="max-w-[1320px] mx-auto">
          <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
            Board of Advisors
          </h1>
        </div>

        <div
          ref={ref}
          className="max-w-[98%] lg:max-w-[1320px] mx-auto flex items-center justify-center flex-wrap gap-7 px-[20px]"
        >
          {/* Advisor person card */}
          {advisors.map((advisor: Advisor, index: number) => (
            <motion.div
              key={index}
              initial={{ scale: 1 }}
              animate={{ scale: hoveredIndex === index ? 0.885 : 1 }}
              transition={{ duration: 0.6 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => handleDivClick(advisor?.url)}
              style={{ cursor: 'pointer' }}
              className="text-center w-[45vw] sm:w-[40vw] md:w-[25vw] lg:w-[15vw] xl:w-[10vw] text-5xl text-white rounded-xl p-2 backdrop-brightness-90 bg-white/5 border border-white/15 shadow-lg"
            >
              {/* Image */}
              <img
                className="rounded-2xl object-cover w-full h-[200px] md:h-[180px] sm:h-[250px]"
                alt={`${advisor.first_name} ${advisor.last_name}`}
                src={advisor?.image}
              />

              {/* Text Content */}
              <div className="flex flex-col h-full justify-between">
                {/* Name */}
                <div>
                  <h3 className="pt-2 font-semibold sm:text-base2 md:text-1xl">
                    {advisor.first_name}
                  </h3>
                  <h3 className="font-semibold sm:text-base2 leading-[20px] md:text-1xl">
                    {advisor.last_name || <br />}
                  </h3>
                </div>

                {/* Role */}
                <p className="px-4 pt-3 text-[10px] font-medium text-background-black-fade-font min-h-[40px]">
                  {advisor.role}
                </p>

                {/* Country */}
                <p className="px-4 pt-2 pb-4 text-xs font-medium text-background-black-fade-font min-h-[20px]">
                  {advisor.country}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvisorsSection;
