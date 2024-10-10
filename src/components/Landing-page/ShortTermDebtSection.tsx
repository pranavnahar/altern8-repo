import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

// Define types for the props
interface TransactionData {
    logo: string;
    invested: string;
    tenure: string;
    yield: string;
    date: string;
}

interface ShortTermDebtProps {
    header: string;
    data: TransactionData[];
    buttonText: string;
    CTAaction?: () => void; // Optional callback
}

function ShortTermDebt({
    header,
    data,
    buttonText,
    CTAaction,
}: ShortTermDebtProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    const [visibleItems, setVisibleItems] = useState<number>(3);

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView]);

    const loadMore = () => {
        if (CTAaction) {
            CTAaction();
        }
        if (!CTAaction) {
            setVisibleItems((prevVisibleItems) => prevVisibleItems + 8);
        }
    };

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
            <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[1320px] my-10 flex flex-col mx-auto">
                <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
                    {header}
                </h1>
                <div
                    ref={ref}
                    className="flex flex-wrap gap-1 sm:gap-1 lg:gap-3 justify-center mx-auto my-[4%]"
                >
                    {data.slice(0, visibleItems).map((transaction, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col w-[49%] sm:w-[29vw] lg:w-[18vw] xl:w-[17vw] items-center justify-center bg-white rounded-3xl shadow-md p-2 custom-bg"
                        >
                            <img
                                src={transaction?.logo}
                                alt={transaction?.logo}
                                className="w-full h-16 sm:h-24 sm:w-[250px] object-contain"
                            />
                            <div className="flex items-center w-[155px] h-[95px] mob-large:w-[200px] sm:w-[200px] sm:h-[105px] lg:w-[198px] lg:h-[110px] xl:w-[225px] xl:h-[130px] relative text-sm font-medium ">
                                <img
                                    src="/short_term_bg.png"
                                    alt="bg_short_term"
                                    className="absolute object-center"
                                />
                                <div className="w-full h-full gap-1 flex flex-col items-center justify-center text-[75%] mob-large:text-[13px] sm:text-[13px] lg:text-sm font-normal">
                                    <p>Invested: {transaction?.invested}</p>
                                    <p>Tenure: {transaction?.tenure}</p>
                                    <p>Yield: {transaction?.yield}</p>
                                    <p className="text-[9px] mob-large:text-[11px] lg:text-[12px]">
                                        {transaction?.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* {visibleItems < data.length && (
                    <span
                        onClick={loadMore}
                        className="mt-5 w-fit cursor-pointer self-center text-center py-2 px-4 rounded-full font-normal text-sm lg:text-base text-white-font bg-[#1565c0] hover:contrast-150"
                    >
                        {buttonText}
                    </span>
                )} */}
            </div>
        </motion.div>
    );
}

export default ShortTermDebt;
