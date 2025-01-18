"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

function ComplaintRegulated() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();
    // images infos
    const imageInfos = [
        {
            name: "sahamati",
            image: "/sahamati-min.png",
            
        },
        {
            name: "RBI",
            image: "/RBI-min.png",
        },
        {
            name: "make in india",
            image: "/make in india-min.png",
        },
       
        // {
        //     name: "ocen",
        //     image: "/ocen-min.png",
        // },
        // {
        //     name: "ondc",
        //     image: "/ondc-min.png",
        // },
    ];

    useEffect(() => {
        if (isInView) {
            // fires the  animation
            mainControls.start('visible');
        }
    }, [isInView]);
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 75 },
                visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={mainControls}
            transition={{ duration: 1, delay: 0.4 }}
        >
            <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[1320px] my-10 mx-auto" ref={ref}>
                <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
                    Compliant and Regulated
                </h1>

                <p className="text-center max-w-[60%] mx-auto font-medium text-background-black-font pb-5">
                    We rigorously adhere to the RBI's prudential norms for risk management, maintaining robust
                    financial foundations to safeguard our firm and contribute to overall financial stability.
                    Our investment decisions are guided by the RBI's regulations, aligning strategically with
                    permissible sectors to support economic development responsibly.
                </p>
                <div className="flex items-center justify-center gap-4 mx-auto">
                    {imageInfos.map((data, index) => (
                        <div key={index} className="relative w-full h-full">
                            <img
                                src={data.image}
                                alt={data.name}
                                // @ts-ignore
                                // objectfit="fill"
                                className="rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ComplaintRegulated;
