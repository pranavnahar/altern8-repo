"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-[#ffffff] dark:bg-neutral-100 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start  p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-500 dark:text-neutral-800 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-400 dark:text-neutral-700 text-base "
                    >
                      {active.description}
                    </motion.p>
                  </div>

                
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-800 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-300 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
     <div >

    <h2 className="text-background-black-font text-center py-8 px-4  text-[40px] font-semibold">Our Team</h2>
      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-start gap-4 px-6">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col  hover:bg-neutral-400  rounded-xl cursor-pointer group"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full  rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-background-black-font  group-hover:text-black  text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-background-black-font  group-hover:text-black text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Investor, Entrepreneur, FinTech",
    title: "Paranav",
    src: "/paranav.jpg",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p className="text-lg  text-black py-2 mb-4 max-h-32 overflow-y-auto">
        Pranav is a visionary entrepreneur and a modern-day Renaissance
        Yogi, blending the worlds of finance, technology, and ancient
        wisdom. Starting his first business at 19 in Oslo, Norway, he
        quickly expanded to 32 countries within three years before
        selling it. A Chevening Scholar and Chazen Fellow, Pranav
        graduated with Dean’s List honors from both London Business
        School and Columbia Business School. <br></br>
        <br></br>
        With over $700 million in transactions to his credit, Pranav has
        been instrumental in launching the Indian operations of a €200
        million LSE-listed carbon finance firm and served as Head of
        Asia at the Grassroots Business Fund, a Washington D.C.-based
        social enterprise private equity outfit. <br></br>
        <br></br>
        Passionate about conscious capitalism, Pranav's journey extends
        beyond finance. He has explored Vipassana and various eastern
        practices, dedicating over 8 years to silent meditation and is a
        trained Vipassana teacher.
      </p>
      );
    },
  },
  {
    description: "Co-Founder @ Nahar OM Family Office",
    title: "Poonam",
    src: "/poonam.avif",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p className="text-lg  text-black py-2 mb-4 max-h-32 overflow-y-auto">
        Poonam is a seasoned HR professional, entrepreneur, and
        transformative coach. With experience spanning talent
        acquisition, HR policy consulting, and Diversity & Inclusion
        (DNI) initiatives, she has facilitated inclusive workplaces and
        led appraisals for small companies in India. Her corporate
        journey includes roles at Bank of America, Canon India, and
        Amazon India. <br></br>
        <br></br>
        Beyond her corporate career, Poonam has co-led over 20 workshops
        and retreats globally, blending modern coaching with ancient
        practices. Certified in Vipassana and well-versed in healing
        modalities like NLP, hypnotherapy, and Kundalini yoga, she
        guides individuals toward self-realization and transformation.
        Poonam’s holistic approach bridges business acumen with deep
        personal growth.
        </p>
      );
    },
  },

  {
    description: "Co-Founder",
    title: "Ketan",
    src: "",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
       
        </p>
      );
    },
  }
];


                  {/* <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a> */}