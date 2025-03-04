'use client';
import React, { FC } from 'react';
import Header from '../Landing-page/Header';
import Footer from '../Landing-page/Footer';
import JoinUsSection from '../Landing-page/JoinUsSection';
import { motion } from 'framer-motion';
import FoundersSection from '../ui/our-founder';
import { MarqueeDemo } from '../ui/marqueeDemo';
import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';
import teams from './constant';
import { ReactNode } from 'react';
import CTASection from '../Landing-page/GetStartedCTA';

interface ClothUnrollEffectProps {
  children: ReactNode;
}

const ClothUnrollEffect = ({ children }: ClothUnrollEffectProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: '100%',
        opacity: 1,
        transition: {
          duration: 2.5,
          ease: [0.45, 1, 0.59, 1], // Custom easing for smooth unroll
        },
      }}
      style={{
        overflow: 'hidden', // Prevents content from being visible until unrolled
        transformOrigin: 'top center',
      }}
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{
          y: 0,
          transition: {
            duration: 0.7,
            ease: 'easeOut',
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const AboutUs: FC = () => {
  const advisors = [
    {
      image: '/advisors/Valorie-min.png',
      name: 'Valorie Wagoner',
      position: 'Head of Product, Global at Stripe',
      location: 'Singapore',
    },
    {
      image: '/advisors/Simon_Ng_Yu_Sum.png',
      name: 'Yu\u00A0Sum Simon Ng',
      position: 'Economic Foreign Policy Analyst',
      location: 'Ontario, Canada',
    },
    {
      image: '/advisors/alexandru-min.png',
      name: 'Alexandru Badulescu',
      position: 'Head Digital Lending, Saudi National Bank',
      location: 'Riyadh, Saudi Arabia',
    },
    {
      image: '/advisors/alain-min.png',
      name: 'Alain\u00A0S',
      position: 'CFO, Burger King Europe',
      location: 'Zug, Switzerland',
    },
    {
      image: '/advisors/lars-min.png',
      name: 'Lars-Erik Odman',
      position: 'Director at Oliver Wyman',
      location: 'UAE',
    },
    {
      image: '/advisors/bob-min.png',
      name: 'Bob Webster',
      position: 'New Investment Lead at DAI',
      location: 'Kyiv, Ukraine',
    },
    {
      image: '/advisors/eugene-min.png',
      name: 'Eugene Prahin',
      position: 'Managing Partner of Sivyxa LLC',
      location: 'New York, USA',
    },
    {
      image: '/advisors/brandon-peele-in.png',
      name: 'Brandon Peele',
      position: 'Co-founder at Unity Lab',
      location: 'California, USA',
    },
    {
      image: '/advisors/noel-min.png',
      name: 'Noel Connolly',
      position: 'Managing Director at The Community',
      location: 'UAE',
    },
    {
      image: '/advisors/kai_roer-min.png',
      name: 'Kai\u00A0Roer',
      position: 'CEO & Founder at Praxis Security Labs',
      location: 'Oslo, Norway',
    },
    {
      image: '/advisors/endre_opdal-min.png',
      name: 'Endre Opdal',
      position: 'CEO & Founder at HotelOnline',
      location: 'Kenya',
    },
    {
      image: '/advisors/maria-hooper-min.png',
      name: 'Maria Hooper',
      position: 'Change Management Consultant, Arcondis',
      location: 'Basel, Switzerland',
    },
  ];

  return (
    <>
      <div className="text-background-black-font overflow-x-hidden [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
        <Header />
        {/* <div className="flex justify-between items-center ml-12 mb-4">
              <Link href="/">
                <button className="text-white text-[40px]">&#8592;</button>
              </Link>
            </div> */}

        <ClothUnrollEffect>
          <div className="flex items-center justify-start ml-14 mt-10 space-x-2">
            <Link href="/">
              <button className="flex items-center text-gray-400 text-[13.5px] font-medium hover:underline hover:text-purple-400">
                <ArrowLeftCircle className="w-4 h-4" /> {/* Adjusted icon size */}
                <span>&nbsp;back to home</span>
              </button>
            </Link>
          </div>

          <section className="py-10 px-4 md:px-14">
            <div className="max-w-7xl mx-auto relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border-2 border-purple-500/30">
              {/* Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/about-us-bg.jpg')",
                }}
              ></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black opacity-40"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black bg-opacity-40 p-8 rounded-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-100/90 mb-4">
                  About Us&#xff0d;Altern8
                </h1>
                <p className="text-gray-100 max-w-full md:max-w-96 text-xs md:text-sm px-4">
                  Altern8 serves as the end-to-end originator and distributor of real estate assets
                  and loans, leveraging cutting-edge data science, AI/ML techniques.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 px-14 shadow-lg">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Column */}
              <div className="flex justify-center items-center">
                <img
                  src="/altern8Main.svg"
                  alt="Our Vision"
                  className="w-full h-auto rounded-lg "
                />
              </div>

              {/* Text Column */}
              <div className="text-center md:text-left">
                <h2 className="mt-32 text-4xl font-semibold mb-6">Our Vision</h2>
                <p className="text-sm text-gray-400 mb-6">
                  At Altern8, our vision is to democratize access to short-term credit and
                  high-yield investment opportunities. We want to infuse consciousness in every
                  transaction. <br />
                  <br />
                  We aim to empower investors and MSMEs alike by fostering a transparent, AI-driven
                  marketplace infused with conscious capitalism and ethical values. We believe in
                  transforming financial ecosystems to create sustainable growth, ensuring every
                  transaction raises trust, transparency, and prosperity.
                </p>
              </div>
            </div>
          </section>

          <section className="py-10 px-14 mt-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-full text-center md:text-left">
                <h2 className="text-4xl font-semibold text-center mb-8">
                  Our Esteemed <span className="text-gradient">Advisory Board</span>
                </h2>
                <p className="text-sm text-center text-gray-400 mb-16 leading-relaxed mx-auto max-w-3xl">
                  A powerhouse of global leaders and experts driving international resilience,
                  regulatory mastery, and market dominance. With expertise spanning fintech,
                  marketing, public policy, and enforcement, our advisors are equipped to
                  future-proof the company, help in debt resolution, and achieve customer growth at
                  unprecedentedly low acquisition costs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {advisors.map((advisor, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: [null, 0.9, 0.9] }}
                      transition={{ duration: 0.7 }}
                      style={{ cursor: 'pointer' }}
                      className="text-center min-h-[22rem] w-[39vw] sm:w-[35vw] md:w-[19vw] lg:w-[11.5vw] xl:w-[11.5vw] text-xl text-white  card-cover rounded-xl p-2 flex flex-col justify-between backdrop-brightness-90 bg-white/5 border border-white/15 shadow-lg"
                    >
                      <img
                        className="rounded-2xl object-cover w-full h-[200px] md:h-[170px] sm:h-[250px]"
                        alt={advisor.name}
                        src={advisor.image}
                      />
                      <div className="flex flex-col flex-grow justify-between mt-2">
                        <h3 className="font-semibold text-md sm:text-base2 md:text-1xl">
                          {advisor.name.split(' ')[0]}
                        </h3>
                        <h3 className="-mt-3 font-semibold text-md sm:text-base2 md:text-1xl leading-[5px]">
                          {advisor.name.split(' ').slice(1).join(' ') || <br />}
                        </h3>
                        <p className="text-sm font-normal text-background-black-fade-font">
                          {advisor.position}
                        </p>
                        <p className="text-xs font-medium text-background-black-fade-font">
                          {advisor.location}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="mt-14 relative w-full py-4">
            <div className="absolute inset-0 flex justify-center">
              <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
          </div>

          <MarqueeDemo />
          <div className="mt-14 relative w-full py-0">
            <div className="absolute inset-0 flex justify-center">
              <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
          </div>
          <FoundersSection />
          <div className="mt-0 relative w-full py-0">
            <div className="absolute inset-0 flex justify-center">
              <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
          </div>

          {/* <JoinUsSection /> */}
          <CTASection />
          <Footer />
        </ClothUnrollEffect>
      </div>
    </>
  );
};

export default AboutUs;
