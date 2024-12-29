"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { InfoIcon } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { getDynamicRedirectUrl } from '@/utils/auth-actions';

const items = [
  'Affordable housing',
  'Plotted land',
  'Advance Loans',
  'Fractional Ownership',
  'Real Estate Investment Trusts',
  'Debentures',
  'Secured Debt',
  'Structured Notes',
  'Commercial Papers',
  'Distressed Situations Finance',
];

const CTASection: React.FC = () => {
    const [redirectUrl, setRedirectUrl] = useState<string>("/register"); // Default to /register

    // framer motion, animation on scroll
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();
  
    useEffect(() => {
      if (isInView) {
        // Fire the animation when the section comes into view
        mainControls.start({ x: 0, opacity: 1 });
      }
    }, [isInView]);
  
    useEffect(() => {
      const fetchRedirectUrl = async () => {
        const url = await getDynamicRedirectUrl();
        setRedirectUrl(url);
      };
  
      fetchRedirectUrl();
    }, []);
  return (
<motion.div
  className="relative m-16 rounded-2xl"
  initial={{ x: '100vw', opacity: 0 }}  
  animate={{ x: 0, opacity: 1 }}       
  transition={{
    type: 'spring',
    stiffness: 60,
    damping: 25,
    duration: 10,
  }}
  whileHover={{
    scale: 0.95, 
    transition: { duration: 5.6, ease: "easeInOut" }  
  }}
>
    <div className="">
    {/* Background SVG */}
      {/* Glass-Like Background */}
      <div className="relative px-16 py-8 [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] backdrop-blur-md border-[3px] border-white/20 rounded-2xl sm:px-8 lg:px-16 lg:py-14">
        <div className="md:flex md:items-center md:space-x-12 lg:space-x-24">
          {/* Features Section */}
          <div className="flex-1">
            <p className="text-sm font-medium text-white mb-6 font-pj">
              Get instant working capital within 24-72 hrs and scale up your business.
            </p>
            <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 gap-x-12 xl:gap-x-24">
              <div>
                <ul className="space-y-3 text-sm font-normal text-gray-300 font-pj">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Rental assets
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Retirement communities
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Hospitality projects
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Serviced apartments
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Warehousing
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Residential
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Commercial
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3 font-normal text-sm text-gray-300 font-pj">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Co living
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Townships
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Vacation properties
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    International properties
                  </li>

                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Redevelopment
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Student accommodation
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button className="flex items-center space-x-2">
                          <span>Many more</span>
                            <InfoIcon className="h-4 w-4" />
                            
                          </button>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="select-none [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] px-4 py-3 text-sm text-gray-300 shadow-lg border border-gray-300/50 rounded "
                            sideOffset={5}
                          >
                            And..
                            <ul>
                              {items.map((item, index) => (
                                <li key={index} className="flex items-center">
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <Tooltip.Arrow className="fill-gray-600" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider Section */}
          <div className="hidden lg:block">
            <svg
              className="w-4 h-auto text-purple-900"
              viewBox="0 0 16 123"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={i}
                  y1="-0.5"
                  x2="18.0278"
                  y2="-0.5"
                  transform={`matrix(-0.83205 -0.5547 -0.5547 0.83205 15 ${11 + i * 7})`}
                  stroke="currentColor"
                />
              ))}
            </svg>
          </div>

          {/* Button Section */}
          <div className="mt-10 md:mt-0 md:ml-auto">
            <p className="text-lg font-bold text-white mb-6">
              Join us and never worry about your finances!
            </p>
            <div className=" text-center">
              <a
                title="Get Credit now"
                className="inline-flex items-center justify-center px-9 py-3.5 text-base font-medium rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-gray-100 ring-2 ring-blue-500/50 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70"
                href={redirectUrl}
              >
                Get Credit now
              </a>
              {/* <a
                title="View our transactions"
                className="inline-flex items-center justify-center px-9 py-3.5 text-base font-medium text-white bg-white bg-opacity-10 border border-gray-100/10 backdrop-blur-md rounded-xl transition-all duration-200 hover:bg-opacity-20 hover:border-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                href="#transactions"
              >
                View our transactions
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
   </motion.div>
  );
};

export default CTASection;
