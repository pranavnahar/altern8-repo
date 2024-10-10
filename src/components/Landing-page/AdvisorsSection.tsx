import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { advisors } from "../../../data/advisors";

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

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const handleDivClick = (url: string) => {
        if (typeof window !== "undefined") {
            window.open(url, "_blank");
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
                    className="max-w-[98%] lg:max-w-[1320px] mx-auto flex items-center justify-center flex-wrap gap-6 px-[20px]"
                >
                    {/* Advisor person card */}
                    {advisors.map((advisor: Advisor, index: number) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: [null, 0.9, 0.9] }}
                            transition={{ duration: 0.7 }}
                            onClick={() => handleDivClick(advisor?.url)}
                            style={{ cursor: "pointer" }}
                            className="text-center max-h-full w-[39vw] sm:w-[35vw] md:w-[19vw] lg:w-[11.5vw] xl:w-[11.5vw] text-5xl text-white card-cover rounded-xl p-2"
                        >
                            <img
                                className="rounded-2xl object-cover w-full h-[200px] md:h-[180px] sm:h-[250px]"
                                alt={`${advisor.first_name} ${advisor.last_name}`}
                                src={advisor?.image}
                            />
                            <h3 className="pt-2 font-semibold sm:text-base2 md:text-2xl">
                                {advisor.first_name}
                            </h3>
                            <h3 className="font-semibold sm:text-base2 md:text-2xl">
                                {advisor.last_name || <br />}
                            </h3>
                            <p className="px-4 pb-4 pt-1 text-[10px] font-medium text-background-black-fade-font">
                                {advisor.role}
                            </p>
                            <p className="px-4 pt-1 pb-4 text-xs font-medium text-background-black-fade-font">
                                {advisor.country}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdvisorsSection;
