import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const offeringsCards = [
    {
        headingFront: 'Advance Loans',
        headingBack: 'Advance Loans For Real-Estate',
        description: [
            {
                heading: 'How It Works?',
                body: 'Provide loans to real estate developers and property owners, helping fund their projects.',
            },
        ],
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'Fractional Ownership',
        headingBack: 'Fractional Ownership For Real-Estate',
        description: [
            {
                heading: 'How It Works?',
                body: "Invest in a portion of high-value real estate with minimal capital and own a share of prime properties.",
            },
        ],
        link: 'https://www.nahar.om/transactions',
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'Real Estate Investment Trusts',
        headingBack: 'Real Estate Investment Trusts',
        description: [
            {
                heading: 'How It Works?',
                body: 'Invest in a professionally managed portfolio of income-generating real estate assets such as shopping malls, office buildings, and residential complexes, with shares traded like stocks.',
            },
        ],
        link: 'http://www.ethyx.club/',
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'High Yield Debenture',
        headingBack: 'High Yield Debenture',
        description: [
            {
                heading: 'How It Works?',
                body: "Invest in unsecured debt issued by real estate companies looking to raise capital. These debentures offer higher interest rates compared to traditional bonds due to the associated risk.",
            },
        ],
        link: 'https://www.nahar.om/ott-media-financing',
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'Secured Debt',
        headingBack: 'Secured Debt',
        description: [
            {
                heading: 'How It Works?',
                body: "Invest in real estate loans backed by collateral, such as properties or other assets. In case of default, the collateral can be claimed to recover the investment.",
            },
        ],
        link: 'http://www.ethyx.club/',
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'Structured Notes',
        headingBack: 'Structured Notes',
        description: [
            {
                heading: 'How It Works?',
                body: 'Invest in customized financial products linked to real estate performance, combining debt and equity elements to offer variable returns based on property market conditions.',
            },
        ],
        link: 'https://www.nahar.om/contact',
        icon: '/ethyx_club.png',
    },
    {
        headingFront: 'Commercial Papers',
        headingBack: 'Commercial Papers',
        description: [
            {
                heading: 'How It Works?',
                body: 'Invest in short-term debt instruments issued by real estate companies to finance immediate operational needs. These papers offer a fixed rate of return over a short duration.',
            },
        ],
        link: 'https://www.nahar.om/contact',
        icon: '/ethyx_club.png',
    },
];


interface OfferingsData {
    headingFront: string;
    headingBack: string;
    description: {
        heading: string;
        body: string;
    }[];
    icon?: string;
}

interface FlipAnimationCardProps {
    data: OfferingsData;
}

const FlipAnimationCard: React.FC<FlipAnimationCardProps> = ({ data }) => {
    // Local states
    const [flip, setFlip] = useState(false);
    const [flipCardSide, setFlipCardSide] = useState(false); // Set initial state to not flipped
    const hoverTimer = useRef<NodeJS.Timeout | null>(null);

    // Destructure data props
    const { headingFront, headingBack, icon, description, link } = data;
    const image = icon ? icon : '/nahar_conscious_capital.jpg'; // Ensure the icon is present or fallback

    // Hover start
    const handleHoverStart = () => {
        hoverTimer.current = setTimeout(() => {
            setFlip(true);
            setTimeout(() => setFlipCardSide(true), 200);
        }, 200); // Delay before flipping
    };

    // Hover end
    const handleHoverEnd = () => {
        setTimeout(() => setFlipCardSide(false), 280); // Delay before flipping back
        clearTimeout(hoverTimer.current!);
        setFlip(false);
    };

    // Clean up effect for hoverTimer
    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer.current!);
            setTimeout(() => setFlipCardSide(false), 280); // Delay before flipping back
        };
    }, []);

    return (
        <motion.div
            className="h-[300px] w-[180px] mx-auto md:w-full sm:h-[300px] sm:w-full lg:h-[320px] lg:w-full flip-card"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
        >
            <motion.div
                className="flex flex-col items-center justify-center w-full h-full overflow-hidden bg-white flip-card-inner card-shadow rounded-3xl"
                transition={{ duration: 0.08, ease: 'easeInOut' }}
                animate={{ rotateY: flip ? 360 : 0 }} // Card flip logic
                initial={{ rotateY: 0 }} // Ensure the card starts in the unflipped state
            >
                {/* Front side of the card */}
                <motion.div
                    className={`h-full w-full flip-card-front p-2 sm:p-2 ${!flipCardSide ? 'block' : 'hidden'
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <h6 className="h-20 p-2 text-base font-medium text-center lg:p-2 lg:px-4 text-background-black-fade-font">
                        {headingFront}
                    </h6>
                    <div className="relative h-[220px] sm:h-[240px] lg:h-[240px] w-full">
                        <img
                            src={image}
                            alt={headingFront}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                </motion.div>

                {/* Back side of the card */}
                <motion.div
                    className={`h-full w-full flip-card-back flex flex-col p-2 items-center ${flipCardSide ? 'block' : 'hidden'
                        }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <h6 className="w-full p-2 text-base font-medium text-center lg:p-2 lg:px-4 h-fit text-background-black-fade-font">
                        {headingBack}
                    </h6>

                    {/* List for the description */}
                    <div className="w-full mt-2 text-sm text-center">
                        {description.map((item, index) => (
                            <div key={index} className="my-2">
                                <h6 className="font-semibold">{item.heading}</h6>
                                <p className="text-xs">{item.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center w-full h-[35%] mt-4">
                        <a href={link} target="_blank" rel="noreferrer" className="m-auto text-blue-500">
                            Explore
                        </a>
                        <div
                            className="m-auto relative h-[100px] w-[100px] mt-2"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

//Main Function
function OurOfferingsSection() {
    //data for the cards

    //hooks
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            // fire the  animation
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
            jk
            <div className="phone:w-[90%] md:w-[70%] xl:w-[60%] xxl:w-[55%] my-10 mx-auto">
                <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-3 text-white-font">
                    Ready to invest in Real-Estate?
                </h1>

                <div className="px-7">
                    <p className="pb-5 font-medium text-center text-background-black-font">
                        Choose between advancing loans or fractional ownership and start building wealth with
                        Altern8 Club today.
                    </p>

                    <div
                        ref={ref}
                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3+ lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-center my-[4%]"
                    >
                        {/* {Looping the data of cards and passing to a Flip ANimation component} */}
                        {offeringsCards.map((offerings, index) => (
                            <div key={index}>
                                <FlipAnimationCard data={offerings} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OurOfferingsSection;
