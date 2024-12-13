"use client"


// function ShortTermDebt({ header, data }) {
//   const [cards, setCards] = useState([]);
//   const [usedIndexes, setUsedIndexes] = useState(new Set());

//   const MAX_CARDS = 8;
//   const REPLACE_INTERVAL = 4000; // 6 seconds per card replacement
//   const TRANSITION_DURATION = 1870; // 2 seconds for transitions

//   useEffect(() => {
//     // Initial data loading
//     if (data.length > 0 && cards.length === 0) {
//       const initialCards = [];
//       const initialUsedIndexes = new Set();

//       while (initialCards.length < MAX_CARDS && initialCards.length < data.length) {
//         const randomIndex = Math.floor(Math.random() * data.length);
//         if (!initialUsedIndexes.has(randomIndex)) {
//           initialCards.push(data[randomIndex]);
//           initialUsedIndexes.add(randomIndex);
//         }
//       }

//       setCards(initialCards);
//       setUsedIndexes(initialUsedIndexes);
//     }
//   }, [data]);

//   useEffect(() => {
//     const replaceCardInterval = setInterval(() => {
//       // Find remaining card indexes
//       const remainingIndexes = data
//         .map((_, index) => index)
//         .filter(index => !usedIndexes.has(index));

//       // Reset if all cards have been used
//       if (remainingIndexes.length === 0) {
//         setUsedIndexes(new Set());
//         return;
//       }

//       // Select a random new card to replace
//       const replaceIndex = Math.floor(Math.random() * MAX_CARDS);
//       const newCardIndex = remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];

//       // Create new cards array with replacement
//       setCards(prevCards => {
//         const newCards = [...prevCards];
//         newCards[replaceIndex] = data[newCardIndex];
        
//         // Update used indexes
//         setUsedIndexes(prev => new Set(prev.add(newCardIndex)));

//         return newCards;
//       });
//     }, REPLACE_INTERVAL);

//     return () => clearInterval(replaceCardInterval);
//   }, [data, usedIndexes]);

//   const cardVariants = {
//     initial: { 
//       opacity: 1, 
//       scale: 1,
//       filter: "brightness(100%) blur(0px)",
//       transition: { 
//         duration: TRANSITION_DURATION / 2000,
//         ease: "easeInOut"
//       }
//     },
//     exit: { 
//       opacity: 0.3, 
//       scale: 0.95,
//       filter: "brightness(30%) blur(10px)",
//       transition: { 
//         duration: TRANSITION_DURATION / 1000,
//         ease: "easeInOut"
//       }
//     },
//     enter: { 
//       opacity: 0.3, 
//       scale: 0.95,
//       filter: "brightness(30%) blur(10px)",
//     },
//     final: { 
//       opacity: 1, 
//       scale: 1,
//       filter: "brightness(100%) blur(0px)",
//       transition: { 
//         duration: TRANSITION_DURATION / 1000,
//         delay: TRANSITION_DURATION / 2000,
//         ease: "easeInOut"
//       }
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 75 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1, delay: 0.4 }}
//     >
//       <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[1320px] my-10 flex flex-col mx-auto">
//         <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
//           {header}
//         </h1>
//         <div className="flex flex-wrap gap-1 sm:gap-1 lg:gap-3 justify-center mx-auto my-[4%] relative">
//           <AnimatePresence mode="popLayout">
//             {cards.map((transaction, index) => (
//               <motion.div
//                 key={`${transaction.logo}-${index}`}
//                 layout
//                 variants={cardVariants}
//                 initial="initial"
//                 exit="exit"
//                 animate="final"
//                 className="flex flex-col w-[49%] sm:w-[29vw] lg:w-[18vw] xl:w-[17vw] items-center justify-center bg-white rounded-3xl shadow-md p-2 custom-bg m-1"
//               >
//                 <motion.img
//                   src={transaction?.logo}
//                   alt={transaction?.logo}
//                   className="w-full h-16 sm:h-24 sm:w-[250px] object-contain"
//                   initial={{ opacity: 0.3, filter: "blur(10px)" }}
//                   animate={{ opacity: 1, filter: "blur(0px)" }}
//                   transition={{ 
//                     duration: TRANSITION_DURATION / 1000,
//                     delay: TRANSITION_DURATION / 2000,
//                     ease: "easeInOut"
//                   }}
//                 />
//                 <div className="flex items-center w-[155px] h-[95px] mob-large:w-[200px] sm:w-[200px] sm:h-[105px] lg:w-[210px] lg:h-[110px] xl:w-[225px] xl:h-[130px] relative text-sm font-medium">
//                   <img
//                     src="/short_term_bg.png"
//                     alt="bg_short_term"
//                     className="absolute object-center"
//                   />
//                   <motion.div 
//                     className="w-full h-full gap-1 flex flex-col items-center justify-center text-[75%] mob-large:text-[13px] sm:text-[13px] lg:text-sm font-normal"
//                     initial={{ opacity: 0.3, filter: "blur(10px)" }}
//                     animate={{ opacity: 1, filter: "blur(0px)" }}
//                     transition={{ 
//                       duration: TRANSITION_DURATION / 1000,
//                       delay: TRANSITION_DURATION / 2000,
//                       ease: "easeInOut"
//                     }}
//                   >
//                     <p>Invested: {transaction?.invested}</p>
//                     <p>Tenure: {transaction?.tenure}</p>
//                     <p>Yield: {transaction?.yield}</p>
//                     <p className="text-[9px] mob-large:text-[11px] lg:text-[12px]">
//                       {transaction?.date}
//                     </p>
//                   </motion.div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default ShortTermDebt;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define types for the transaction data
interface Transaction {
  logo: string;
  invested: string;
  tenure: string;
  yield: string;
  date: string;
}

interface ShortTermDebtProps {
  header: string;
  data: Transaction[];
}

function ShortTermDebt({ header, data }: ShortTermDebtProps) {
  const [cards, setCards] = useState<Transaction[]>([]);
  const [usedIndexes, setUsedIndexes] = useState<Set<number>>(new Set());

  const MAX_CARDS = 8;
  const REPLACE_INTERVAL = 4000; // 4 seconds per card replacement
  const TRANSITION_DURATION = 1870; // 2 seconds for transitions

  useEffect(() => {
    // Initial data loading
    if (data.length > 0 && cards.length === 0) {
      const initialCards: Transaction[] = [];
      const initialUsedIndexes = new Set<number>();

      while (initialCards.length < MAX_CARDS && initialCards.length < data.length) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!initialUsedIndexes.has(randomIndex)) {
          initialCards.push(data[randomIndex]);
          initialUsedIndexes.add(randomIndex);
        }
      }

      setCards(initialCards);
      setUsedIndexes(initialUsedIndexes);
    }
  }, [data]);

  useEffect(() => {
    const replaceCardInterval = setInterval(() => {
      // Find remaining card indexes
      const remainingIndexes = data
        .map((_, index) => index)
        .filter(index => !usedIndexes.has(index));

      // Reset if all cards have been used
      if (remainingIndexes.length === 0) {
        setUsedIndexes(new Set());
        return;
      }

      // Select a random new card to replace
      const replaceIndex = Math.floor(Math.random() * MAX_CARDS);
      const newCardIndex = remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];

      // Create new cards array with replacement
      setCards(prevCards => {
        const newCards = [...prevCards];
        newCards[replaceIndex] = data[newCardIndex];
        
        // Update used indexes
        setUsedIndexes(prev => new Set(prev.add(newCardIndex)));

        return newCards;
      });
    }, REPLACE_INTERVAL);

    return () => clearInterval(replaceCardInterval);
  }, [data, usedIndexes]);

  const cardVariants = {
    initial: { 
      opacity: 1, 
      scale: 1,
      filter: "brightness(100%) blur(0px)",
      transition: { 
        duration: TRANSITION_DURATION / 2000,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0.3, 
      scale: 0.95,
      filter: "brightness(30%) blur(10px)",
      transition: { 
        duration: TRANSITION_DURATION / 1000,
        ease: "easeInOut"
      }
    },
    enter: { 
      opacity: 0.3, 
      scale: 0.95,
      filter: "brightness(30%) blur(10px)",
    },
    final: { 
      opacity: 1, 
      scale: 1,
      filter: "brightness(100%) blur(0px)",
      transition: { 
        duration: TRANSITION_DURATION / 1000,
        delay: TRANSITION_DURATION / 2000,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 75 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[1320px] my-10 flex flex-col mx-auto">
        <h1 className="py-5 mb-3 font-semibold tracking-tighter text-center text-21xl lg:mb-7 text-white-font">
          {header}
        </h1>
        <div className="flex flex-wrap gap-1 sm:gap-1 lg:gap-3 justify-center mx-auto my-[4%] relative">
          <AnimatePresence mode="popLayout">
            {cards.map((transaction, index) => (
              <motion.div
                key={`${transaction.logo}-${index}`}
                layout
                variants={cardVariants}
                initial="initial"
                exit="exit"
                animate="final"
                className="flex flex-col w-[49%] sm:w-[29vw] lg:w-[18vw] xl:w-[17vw] items-center justify-center bg-white rounded-3xl shadow-md p-2 custom-bg m-1"
              >
                <motion.img
                  src={transaction?.logo}
                  alt={transaction?.logo}
                  className="w-full h-16 sm:h-24 sm:w-[250px] object-contain"
                  initial={{ opacity: 0.3, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ 
                    duration: TRANSITION_DURATION / 1000,
                    delay: TRANSITION_DURATION / 2000,
                    ease: "easeInOut"
                  }}
                />
                <div className="flex items-center w-[155px] h-[95px] mob-large:w-[200px] sm:w-[200px] sm:h-[105px] lg:w-[210px] lg:h-[110px] xl:w-[225px] xl:h-[130px] relative text-sm font-medium">
                  <img
                    src="/short_term_bg.png"
                    alt="bg_short_term"
                    className="absolute object-center"
                  />
                  <motion.div 
                    className="w-full h-full gap-1 flex flex-col items-center justify-center text-[75%] mob-large:text-[13px] sm:text-[13px] lg:text-sm font-normal"
                    initial={{ opacity: 0.3, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ 
                      duration: TRANSITION_DURATION / 1000,
                      delay: TRANSITION_DURATION / 2000,
                      ease: "easeInOut"
                    }}
                  >
                    <p>Invested: {transaction?.invested}</p>
                    <p>Tenure: {transaction?.tenure}</p>
                    <p>Yield: {transaction?.yield}</p>
                    <p className="text-[9px] mob-large:text-[11px] lg:text-[12px]">
                      {transaction?.date}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default ShortTermDebt;