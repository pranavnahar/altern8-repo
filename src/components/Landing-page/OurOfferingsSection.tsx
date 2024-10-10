import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
// Define the types for props
interface VimeoEmbedProps {
  videoId: string;
}

interface OfferingsData {
  name: string;
  description: string;
  link: string;
  icon?: string;
}

interface FlipAnimationCardProps {
  data: OfferingsData;
}

// VimeoEmbed component
const VimeoEmbed: React.FC<VimeoEmbedProps> = ({ videoId }) => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
      className="sm:h-[250px] md:h-[300px ] lg:h-[560px] sm:w-[90%] lg:w-[75%] sm:mt-28 mx-auto"
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Vimeo Video"
      />
    </div>
  );
};

const FlipAnimationCard: React.FC<FlipAnimationCardProps> = ({ data }) => {
  // Local states
  const [flip, setFlip] = useState(false);
  const [flipCardSide, setFlipCardSide] = useState(false); // Set initial state to not flipped
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  // Destructure data props
  const { name, description, icon, link } = data;
  const image = icon ? icon : '/nahar_conscious_capital.jpg'; // Ensure the icon is present or fallback

  // Hover start
  const handleHoverStart = () => {
    hoverTimer.current = setTimeout(() => {
      setFlip(true);
      setTimeout(() => setFlipCardSide(true), 300);
    }, 300); // Delay before flipping
  };

  // Hover end
  const handleHoverEnd = () => {
    setTimeout(() => setFlipCardSide(false), 300); // Delay before flipping back
    // @ts-ignore
    clearTimeout(hoverTimer.current);
    setFlip(false);
  };

  // Clean up effect for hoverTimer
  useEffect(() => {
    return () => {
      // @ts-ignore
      clearTimeout(hoverTimer.current);
      setTimeout(() => setFlipCardSide(false), 300); // Delay before flipping back
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
        transition={{ duration: 0.1, ease: 'easeInOut' }}
        animate={{ rotateY: flip ? 180 : 0 }} // Card flip logic
        initial={{ rotateY: 0 }} // Ensure the card starts in the unflipped state
      >
        {/* Front side of the card */}
        <motion.div
          className={`h-full w-full flip-card-front p-2 sm:p-2 ${
            !flipCardSide ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h6 className="h-20 p-2 text-base font-medium text-center lg:p-2 lg:px-4 text-background-black-fade-font">
            {name}
          </h6>
          <div className="relative h-[220px] sm:h-[240px] lg:h-[240px] w-full">
            <img
              src={image}
              alt={name}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
        </motion.div>

        {/* Back side of the card */}
        <motion.div
          className={`h-full w-full flip-card-back flex flex-col p-2 items-center ${
            flipCardSide ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h6 className="w-full p-2 text-base font-medium text-center lg:p-2 lg:px-4 h-fit text-background-black-fade-font">
            {name}
          </h6>
          <p className="text-[12px] mt-2 sm:text-sm md:text-sm lg:text-sm text-center w-full flex-1">
            {description}
          </p>
          <div className="text-center w-full h-[35%]">
            <a href={link} target="_blank" rel="noreferrer" className="m-auto text-blue-500 mt-7">
              Explore
            </a>
            <div
              className="m-auto relative h-[100px] w-[100px]"
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
  const offeringsCards = [
    {
      name: 'Invoice discounting',
      description:
        'Ethyx Club is a seamless frictionless fintech to get instant lines of credit for your invoices based on just simple inputs of your mobile phone.',
      icon: '/ethyx_club.png',
    },
    {
      name: 'Reverse Receivables Factoring',
      description:
        "Unlock your supply chain's value with our lines of credit, empowering both suppliers and buyers to grow on their terms.",
      link: 'https://www.nahar.om/transactions',
      icon: '/ethyx_club.png',
    },
    {
      name: 'Recurring Revenue Financing',
      description:
        'Offers based purely on the health of your revenue. Simple, fair payments that sync with your sales.',
      link: 'http://www.ethyx.club/',
      icon: '/ethyx_club.png',
    },
    {
      name: 'OTT - Media Financing',
      description:
        "Never miss out on your production's full potential due to bad timing. Access capital precisely when you need it and seize every big opportunity.",
      link: 'https://www.nahar.om/ott-media-financing',
      icon: '/ethyx_club.png',
    },
    {
      name: 'Influencer Financing',
      description:
        "Ethyx Club offers instant lines of credit for your invoices via a simple mobile input. It's working capital that simply works.",
      link: 'http://www.ethyx.club/',
      icon: '/ethyx_club.png',
    },
    {
      name: 'Merchant POS & UPI financing',
      description:
        'Easy way for merchants to access capital without the frustration of traditional financing. No lengthy application process.',
      link: 'https://www.nahar.om/contact',
      icon: '/ethyx_club.png',
    },
    {
      name: 'Venture Debt & Convertible Notes',
      description:
        'Extend your cash burn and delay your series equity financing rounds, dilute less equity via our venture debt & convertible lines of capital',
      link: 'https://www.nahar.om/contact',
      icon: '/ethyx_club.png',
    },
  ];
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
      <div className="phone:w-[90%] md:w-[70%] xl:w-[60%] xxl:w-[55%] my-10 mx-auto">
        <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
          Our Offerings
        </h1>

        <div className="px-7">
          <p className="pb-5 font-medium text-center text-background-black-font">
            We've been at the forefront of shaping credit investments, commanding Lines of Credit
            worth 500 million USD from prestigious banking institutions. Our founders driven by
            unwavering trust and passion for ethical business, have sealed transactions worth half a
            billion USD across major global cities, from Mumbai to New York.
          </p>

          <div
            ref={ref}
            className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3+ lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-center my-[4%]"
          >
            {/* {Looping the data of cards and passing to a Flip ANimation component} */}
            {offeringsCards.map((offerings, index) => (
              <div key={index}>
                <FlipAnimationCard data={offerings as OfferingsData} />
              </div>
            ))}
          </div>
          {/* <VimeoEmbed videoId="927123641?h=62fed1ec9a" /> */}
        </div>
      </div>
    </motion.div>
  );
}

export default OurOfferingsSection;
