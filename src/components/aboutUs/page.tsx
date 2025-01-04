"use client";
import React, { useState, useRef, FC } from "react";
import { ExpandableCardDemo } from "../../components/our-founder";
import { MarqueeDemo } from "../../components/advisors-marque";
import Link from 'next/link';

const AboutUsPage: React.FC = () => {
  interface Advisor {
    name: string;
    position: string;
    location: string;
    image: string;
  }

  const advisors: Advisor[] = [
    {
      image: "/advisors-image/image1.png",
      name: "Valorie Wagoner",
      position: "Head of Product, Global at Stripe",
      location: "Singapore",
    },
    {
      image: "/advisors-image/image2.png",
      name: "Yu Sum Simon Ng",
      position: "Economic Foreign Policy Analyst",
      location: "Ontario, Canada",
    },
    {
      image: "/advisors-image/image3.png",
      name: "Alexandru Badulescu",
      position: "Head of Payments and Lending, Advisor to CEO of Digital Ventures",
      location: "Riyadh, Soudi",
    },
    {
      image: "/advisors-image/image4.png",
      name: "Alain S.",
      position: "CFO, Burger King Europe",
      location: "Zug, Switzerland",
    },
    {
      image: "/advisors-image/image5.png",
      name: "Laras-Erik Odman",
      position: "Director at Oliver Wyman",
      location: "UAE",
    },
    {
      image: "/advisors-image/image6.png",
      name: "Bob Webster",
      position: "New Investment Lead at DAI",
      location: "Kylv, Ukraine",
    },
    {
      image: "/advisors-image/image7.png",
      name: "Eugene Prahin",
      position: "Managing Partner aof Sivyxa LLC",
      location: "New York, USA",
    },
    {
      image: "/advisors-image/image8.png",
      name: "Brandon Peele",
      position: "Co-founder at Unity Lab",
      location: "California, USA",
    },
    {
      image: "/advisors-image/image9.png",
      name: "Noel Connolly",
      position: "Managing Director at The Community",
      location: "UAE",
    },
    {
      image: "/advisors-image/image10.png",
      name: "Kai Roer",
      position: "CEO & Founder at Proxis Security Labs",
      location: "Oslo, Norway",
    },
    {
      image: "/advisors-image/image11.png",
      name: "Endre Opdal",
      position: "CEO & Founder at HotelOnline",
      location: "Kenya",
    },
    {
      image: "/advisors-image/image12.png",
      name: "Maria Hooper",
      position: "Organisational Change Consultant at Arcondis",
      location: "Basel, Switzerland",
    },
  ];

  interface Team {
    name: string;
    image: string;
  }

  const teams: Team[] = [
    {
      image: "/vivek.avif",
      name: "Vivek",
    },
    {
      image: "/anurag.avif",
      name: "Anurag",
    },
    {
      image: "/Talib.jpg",
      name: "Talib",
    },
    {
      image: "/kumar.avif",
      name: "Raj",
    },
    {
      image: "/jinith.avif",
      name: "Jinith",
    },
    {
      image: "/Arunkumar.avif",
      name: "Arunkumar",
    },
    {
      image: "/sanjukta.avif",
      name: "Sanjukta",
    },
    {
      image: "ajith.avif",
      name: "Ajith",
    },
  ];




  return (
    <>
      <div className="text-background-black-font">

      <div className="flex  justify-between items-center ml-12 mb-4">
      <Link href="/">
        <button
        className="text-white text-[40px]"
        >
           &#8592;
        </button>
        </Link>
      </div>  

        <section className="py-10 px-14">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Text Section */}

            <div className="md:w-full text-center md:text-left">
              <h2 className="text-4xl  text-center font-semibold mb-8">Our Mission is to infuse <span className="text-gradient">consciousness in  every transaction.</span></h2>
              <p className="text-lg    mb-4">
              Ethyx Estate envisions transforming the opaque small real estate industry, into creditable, transparent, accessible investment opportunities. By harnessing cutting-edge AI and data science, we aim to create a seamless, secure marketplace that empowers investors with high-yield returns and fosters trust through transparency and underbanked small real estate developers with finance with ease " Through fractional investments, liquidity facilitation, and robust risk engines, Ethyx Estate makes complex investments and financing simple and accessible for all." 
              </p>
            </div>
          </div>
        </section>

        <section className="py-2 px-14">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Image Section */}
            <div className="w-full text-center md:text-left">
              <h2 className="text-[50px] font-semibold text-center  mb-8">
                Our Esteemed{" "}
                <span className="text-gradient">Advisory Board</span>
              </h2>
 
              <p className="text-[20px] font-normal text-center  mb-12">
              A powerhouse of global leaders and experts driving international resilience, regulatory mastery, and market dominance. With expertise spanning fintech, marketing, public policy and enforcement, our advisors are equipped to future-proof the company, help in debt resolution, and achieve customer growth at unprecedentedly low acquisition costs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
                {advisors.map((advisor, index) => (
                  <div key={index} className="rounded-lg  border ">
                    <div>
                      <img
                        src={advisor.image}
                        //  alt={advisor.name}
                        className="object-cover   w-full h-44 rounded-lg"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-[18px] font-semibold  leading-[18px]">
                        {advisor.name}
                      </h3>
                      <div className="mt-2 ">
                        <p className="text-[12px] font-light leading-[13px] ">
                          {advisor.position}
                        </p>
                        <p className="text-xs font-light">
                          {advisor.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
          </div>
        </section>

        <MarqueeDemo/>
         {/* <CardHoverEffectDemo /> */}
        <ExpandableCardDemo />

        {/* Mission Section */}
        <section className="py-16 px-14">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full text-center ">
              <h2 className="text-5xl text-center  font-semibold mb-12">
                Our Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {teams.map((team, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="object-cover w-32 h-32 rounded-full"
                    />
                    <h3 className="text-[13px] font-semibold  text-center w-full leading-[18px] mt-2">
                      {team.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUsPage;
