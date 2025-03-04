"use client"
import { useEffect, useState } from "react";
import Counter from "./Counter";

const CounterSection: React.FC = () => {
    const [restartTrigger, setRestartTrigger] = useState(0);

    useEffect(() => {
        const animate = () => {
            // Force reset to 0
            setRestartTrigger(prev => prev + 1);
        };

        // Initial animation
        animate();

        // Set up interval for repeated animations
        const interval = setInterval(animate, 6000); // 3s animation + 3s pause

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pt-[160px] sm:pt-[160px] lg:pt-[120px] px-5">
            <div
                className="max-w-[1320px] mx-auto pb-10 lg:pb-0 mb-10 lg:mb-[50px] grid
                lg:grid-cols-3 md:grid-cols-2 gap-6 rounded-xl
                [background:linear-gradient(65.92deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050_99.08%),_#fff]
                shadow-[0px_22px_40px_rgba(0,_0,_0,_0.16)]"
            >
                <div className="text-5xl text-center text-white pt-7 lg:py-10">
                    <div className="pt-2 text-21xl font-semibold flex items-center justify-center gap-[9px]">
                        <Counter value={165} className="text-white" restartTrigger={restartTrigger}/> Cr
                        <img className="w-6 h-8 mt-1" alt="" src="/vector1.svg" />
                    </div>
                    <p className="text-xl font-medium lg:pb-4 text-background-black-fade-font">
                        Transaction Amount
                    </p>
                </div>

                <div className="text-5xl text-center text-white pt-7 lg:py-10">
                    <div className="pt-2 text-21xl font-semibold flex items-center justify-center gap-[9px]">
                        <Counter value={225} className="text-white" restartTrigger={restartTrigger} />
                        <img className="w-6 h-8 mt-1" alt="" src="/vector2.svg" />
                    </div>
                    <p className="pb-4 text-xl font-medium lg:pb-4 text-background-black-fade-font">
                        Square Ft.
                    </p>
                </div>

                <div className="text-5xl text-center text-white pt-7 lg:py-10">
                    <div className="pt-2 text-21xl font-semibold flex items-center justify-center gap-[9px]">
                        <p className="relative">0.00</p>
                        <img
                            className="relative w-[30px] h-[30px] mt-1 overflow-hidden shrink-0"
                            alt=""
                            src="/frame.svg"
                        />
                    </div>
                    <p className="pb-4 text-xl font-medium lg:pb-4 text-background-black-fade-font">
                        NPAs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CounterSection;