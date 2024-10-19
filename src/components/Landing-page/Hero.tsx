import React, { useState, useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";

//For Cursor Animation
const CursorBlinker: React.FC = () => {
    //Variants for cursor motion
    const cursorVariants = {
        blinking: {
            opacity: [0, 0, 1, 1],
            transition: {
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0,
                ease: "linear",
                times: [0, 0.5, 0.5, 1],
            },
        },
    };
    return (
        <motion.div
            variants={cursorVariants}
            animate="blinking"
            className="inline-block h-full ml-1 w-[4px] translate-y-1 bg-white"
        />
    );
};

//For Typing Animation
const TypingAnimation: React.FC = () => {
    const taglines = [
        "Conscious Capitalism",
        "Invoice Discounting",
        "Receivables Factoring",
        "Purchase Order Finance",
        "Inventory Leaseback Finance",
        "Deep Tier Trade Finance",
        "Working Capital Finance",
        "ESG Finance",
        "MSME Unsecured Finance",
        "Revenue Finance",
        "Ecommerce Sales Finance",
    ];

    const textIndex = useMotionValue(0);
    const baseText = useTransform(textIndex, (latest) => taglines[latest] || "");
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) =>
        baseText.get().slice(0, latest)
    );
    const updatedThisRound = useMotionValue(true);

    useEffect(() => {
        animate(count, 60, {
            type: "tween",
            delay: 0.5,
            duration: 4,
            ease: "easeIn",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.1,
            onUpdate(latest) {
                if (updatedThisRound.get() === true && latest > 0) {
                    updatedThisRound.set(false);
                } else if (updatedThisRound.get() === false && latest === 0) {
                    if (textIndex.get() === taglines.length - 1) {
                        textIndex.set(0);
                    } else {
                        textIndex.set(textIndex.get() + 1);
                    }
                    updatedThisRound.set(true);
                }
            },
        });
    }, [count, textIndex, taglines, updatedThisRound]);

    return <motion.div className="inline">{displayText}</motion.div>;
};

// main return function
const HeroSection: React.FC = () => {
    return (
        <div>
            <div className="max-w-[1320px] h-[300px] mx-auto px-5 sm:px-0 xl:px-0">
                <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row">
                    <div className="text-center sm:text-start sm:mx-5 2xl:mx-auto basis-1/2 text-21xl text-white">
                        {/* changing tagline text animation */}
                        <div className="flex flex-row w-full relative">
                            <motion.div>
                                <span className="absolute text-20xl h-10 lg:text-21xl font-semibold text-left mt-[150px]">
                                    <TypingAnimation />
                                    <CursorBlinker />
                                </span>
                            </motion.div>
                        </div>

                        {/* Get Credit button link */}
                        <Link
                            href="/register"
                            className="relative inline-flex items-center h-[40px] w-[130px] 
                sm:h-[50px] sm:w-[200px] mt-[300px] sm:mt-[260px] justify-center p-4 px-6 py-3 overflow-hidden
                font-medium font-roboto text-white-font transition duration-300 ease-out
                rounded-full group"
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
                            <span className="absolute flex items-center font-normal justify-center h-full w-full text-base2 sm:text-5xl lg:text-5xl text-white-font bg-[#1565c0] transition-all duration-300 transform group-hover:translate-x-full ease">
                                Get Credit
                            </span>
                            <span className="relative invisible">Get Credit</span>
                        </Link>
                    </div>

                    {/* hero section description text */}
                    <div className="hidden md:inline text-left basis-1/2 text-white">
                        {/* text animation */}
                        <motion.div
                            initial={{ x: 1000 }}
                            animate={{ x: [900, 0] }}
                            transition={{ duration: 2, delay: 0.2 }}
                            whileHover={{ scale: 0.9, opacity: 0.9 }}
                            className="flex-1 relative text-xl mt-[150px] tracking-[-0.5px] font-medium text-background-black-font"
                        >

                            Discover a new era in lending with Altern8 Club, your ultimate alternate platform and
                            marketplace connecting borrowers with patrons. As a trailblazer in the industry,
                            Altern8 Club serves as the end-to-end originator and distributor of real estate assets and loans,
                            leveraging cutting-edge data science, Artificial Intelligence, and Machine Learning
                            techniques. We specialize in demystifying complex industries with opaque data,
                            starting with our fully automated data aggregation stack that delivers results in
                            minutes, beginning with just a simple mobile number.
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
