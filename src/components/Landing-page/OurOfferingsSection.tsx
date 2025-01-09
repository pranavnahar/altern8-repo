"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';

const offeringsCards = [
  {
    headingFront: 'Advance Loans',
    description: [
      {
        // heading: 'How It Works?', //ON 9 Jan pranav sir told to remove this heading
        body: 'Secure funding for your real estate projects by offering debt instruments to a diverse pool of interested Patrons',
      },
    ],
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Fractional Ownership',

    description: [
      {
        // heading: 'How It Works?',
        body: 'Offer a portion of your high-value Real Estate as equity ownership to patrons who can invest in Factorial Units.',
      },
    ],
    link: 'https://www.nahar.om/transactions',
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Real Estate Investment Trusts (SMREIT)',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Offer access to a portfolio of income-generating Real Estate assets, including shopping malls, office buildings, and warehouses, through Real Estate Investment Trusts (REITs)',
      },
    ],
    link: 'http://www.ethyx.club/',
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Debentures',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Offer Patrons secured Debentures and raise capital for your Real Estate Projects.',
      },
    ],
    link: 'https://www.nahar.om/ott-media-financing',
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Secured Debt',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Receive loans backed by collateral such as land, buildings, and properties.',
      },
    ],
    link: 'http://www.ethyx.club/',
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Structured Notes',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Structured notes allow Real Estate Project owners to access flexible funding options while aligning with market dynamics while offering benefits like tailored repayment structures, potential cost savings, and enhanced funding flexibility.',
      },
    ],
    link: 'https://www.nahar.om/contact',
    icon: '/images/altern8logo.png',
  },
  {
    headingFront: 'Commercial Papers',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Offer short-term debt instruments of less than a year to finance immediate operational needs.',
      },
    ],
    link: 'https://www.nahar.om/contact',
    icon: '/images/altern8logo.png',
  },
  ,
  {
    headingFront: 'Distressed Situations Finance',
    description: [
      {
        // heading: 'How It Works?',
        body: 'Get urgent Finance for stuck Projects, over-leveraged, or NCLT case Projects with innovative financial solutions for our risk-taking Patrons.',
      },
    ],
    link: 'https://www.nahar.om/contact',
    icon: '/images/altern8logo.png',
  },
];

interface OfferingsData {
  headingFront: string;
  description: {
    // heading: string;
    body: string;
  }[];
  icon?: string;
  link?: string;
}

interface FlipAnimationCardProps {
  data: OfferingsData;
}

const FlipAnimationCard: React.FC<FlipAnimationCardProps> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { headingFront, icon, description, link } = data;
  const image = icon || '/nahar_conscious_capital.jpg';

  return (
    <div
      className="flip-card-container w-96 h-96"
      style={{
        perspective: '1000px',
        margin: '1rem', // This creates gap between cards
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flip-card"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
        }}
        animate={{ rotateY: isHovered ? 180 : 0 }}
      >
        <div
          className="flip-card-front"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h6 className="text-[1.50] font-medium text-center text-zinc-500">{headingFront}</h6>
          <div className="w-full h-3/4">
            <img src={image} alt={headingFront} className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
        <div
          className="flip-card-back"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'white',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* <h6 className="text-[1.50] font-medium text-center text-zinc-500">{headingBack}</h6> */}
          <div className="flex-grow overflow-auto">
            {description.map((item, index) => (
              <div key={index} className="my-2 mt-10">
                {/* <h6 className="font-semibold text-center">{item.heading}</h6> */}
                <p className="text-sm text-center mt-3">{item.body}</p>
              </div>
            ))}
          </div>
          {/* <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-blue-500"
          >
          Inquire
          </a> */}

          <Link
            href="#contact-form"
            className=" text-blue-500 mt-2 hover:cursor-pointer"
          >
            Inquire
          </Link>
          <div className="mt-2 w-16 h-16">
            <img src={image} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

//Main Function
function OurOfferingsSection() {
  // Hooks
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Fire the animation
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
      transition={{ duration: 0.5, delay: 0.03 }}
    >
      <div className="phone:w-[90%] md:w-[70%] xl:w-[76%] xxl:w-[55%] my-10 mx-auto">
        <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-3 text-white-font">
          Ready to invest in Real Estate?
        </h1>

        <div className="px-7">
          <p className="pb-5 font-medium text-center text-background-black-font">
            Choose between advancing loans or fractional ownership and start building wealth with
            Altern8 Club today.
          </p>

          <div ref={ref} className="flex flex-wrap justify-center my-[4%]">
            {offeringsCards.map((offerings, index) => (
              <div key={index} className="w-full sm:w-1/2 md:w-1/4 flex justify-center">
                <FlipAnimationCard data={offerings!} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default OurOfferingsSection;
