// // reviews section for landing page

// import { useEffect, useState, useRef } from 'react';
// import { motion, useInView, useAnimation } from 'framer-motion';
// import { Dot } from 'lucide-react';

// const ReviewSection = () => {
//     // storing the reviews
//     // const reviews = [
//     //     {
//     //         id: 1,
//     //         heading:
//     //             '“Exceptional funding website! User-friendly interface, robust features, prompt customer support',
//     //         review:
//     //             "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. ”",
//     //         name: 'Raghav Sharma',
//     //         post_name: 'Managing Director, logitech',
//     //         img: '/logitechseeklogocom2-1.svg',
//     //     },
//     //     {
//     //         id: 2,
//     //         heading:
//     //             '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-2',
//     //         review:
//     //             "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. 2”",
//     //         name: 'Raghav Sharma',
//     //         post_name: 'Managing Director, logitech',
//     //         img: '/logitechseeklogocom2-1.svg',
//     //     },
//     //     {
//     //         id: 3,
//     //         heading:
//     //             '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-3',
//     //         review:
//     //             "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. 3”",
//     //         name: 'Raghav Sharma',
//     //         post_name: 'Managing Director, logitech',
//     //         img: '/logitechseeklogocom2-1.svg',
//     //     },
//     // ];

//     const reviews = [
//         {
//           id: 1,

//           review:
//             'Altern8 made the invoice discounting process straightforward, allowing us to quickly access funds that were otherwise tied up in our receivables. This has significantly improved our cash flow, helping us keep up with growing demand without financial strain.',
//         },
//         {
//           id: 2,
//           // heading:
//           //   '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-2',
//           review:
//             'Bill discounting through Altern8 has been a good for us. It’s allowed us to leverage our outstanding invoices and gain immediate cash flow, enabling us to meet operational needs smoothly and on time.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//         {
//           id: 3,
//           // heading:
//           //   '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-3',
//           review:
//             'Altern8’s recurring revenue financing has been essential in scaling our SaaS company without taking on traditional debt. With their support, we could bring in cash against predictable revenue, which fueled our product development and team growth effortlessly.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//         {
//           id: 4,

//           review:
//             'As an ecommerce trader with consistent revenue but minimal profit, traditional loans were challenging to secure. Altern8’s revenue-based financing bridged this gap and allowed us to access funds based on our revenue potential, which was just what we needed to drive growth.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//         {
//           id: 5,

//           review:
//             'Thanks to Altern8’s purchase order financing, we could confidently accept large orders without worrying about the working capital required upfront. This financing option was critical in supporting our growth, and Altern8’s team made the process seamless.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//         {
//           id: 6,

//           review:
//             'Altern8’s inventory financing solution enabled us to scale our stock levels ahead of the peak season. It also improved our metrics with Equity Investors with much lesser inventory on our books. With quick access to funds, we could meet high customer demand without overextending our cash reserves, ensuring smooth operations and growth.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },

//         {
//           id: 7,

//           review:
//             'Supply chain financing with Altern8 helped us keep our production line running smoothly by providing necessary funds to pay our suppliers on time. Altern8 truly understood our supply chain needs and offered tailored solutions that made a difference in our daily operations.',
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//         {
//           id: 8,
//           heading:
//             // '“Exceptional funding website! User-friendly interface, robust features, prompt customer support',
//             '“Working Capital Finance Testimonial',
//           review:
//             "Altern8’s working capital finance was exactly what we needed to fuel our daily operations without worrying about cash flow disruptions. Their flexible terms and supportive team have made our journey toward stability and growth much easier."
//           // name: 'Raghav Sharma',
//           // post_name: 'Managing Director, logitech',
//           // img: '/logitechseeklogocom2-1.svg',
//         },
//       ];

//     //  for reviews
//     const [currentIndex, setCurrentIndex] = useState(0);

//     // go to last review
//     const prevReview = () => {
//         const isFirstReview = currentIndex === 0;
//         const newIndex = isFirstReview ? reviews.length - 1 : currentIndex - 1;
//         setCurrentIndex(newIndex);
//     };

//     // Function to go to the next review
//     const nextReview = () => {
//         setCurrentIndex(prevIndex => {
//             const isLastReview = prevIndex === reviews.length - 1;
//             return isLastReview ? 0 : prevIndex + 1;
//         });
//     };

//     // useEffect to call nextReview every second
//     useEffect(() => {
//         // Set up an interval that calls nextReview every 2000 milliseconds (2 seconds)
//         const intervalId = setInterval(() => {
//             nextReview();
//         }, 4000);

//         // Clean up the interval when the component unmounts
//         return () => clearInterval(intervalId);
//     }, []); // Empty dependency array ensures that the effect runs only once (on mount)

//     // for review scroll dots
//     //   @ts-ignore
//     const goToReview = reviewIndex => {
//         setCurrentIndex(reviewIndex);
//     };

//     // framer motion , animation on scroll
//     const ref = useRef(null);
//     const isInView = useInView(ref, { once: true });
//     const mainControls = useAnimation();
//     const mainControlsReview = useAnimation();

//     useEffect(() => {
//         if (isInView) {
//             // fire the  animation
//             mainControls.start({ x: [-900, 0] });
//             mainControlsReview.start({ x: [900, 0] });
//         }
//     }, [isInView]);

//     return (
//         <div className="w-full group">
//             <div className="container justify-center max-w-[1340px] mx-auto pt-10 text-white-font font-work-sans group">
//                 {/* <div className="relative box-border mx-7 h-[3px] border-t-[3px] border-solid border-white-font" />
//                 <div /> */}
//                 {/* <div className="max-w-[1320px] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-6 "> */}
//                 <div className="max-w-[1320px] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3 text-center justify-center items-center ">
//                     {/* <div ref={ref} className="lg:col-span-2">
//                         {/* animation
//                         <motion.div
//                             // initial={{ x: -1000 }}
//                             // animate={{ x: [-900, 0] }}
//                             animate={mainControls}
//                             transition={{ duration: 2, delay: 0.2 }}
//                             whileHover={{ scale: 0.95, opacity: 0.9 }}
//                         >
//                             {/*review company logo image
//                             {/* <img
//                                 className="w-[250px] h-[150px] px-10  sm:w-[350 px] sm:h-[130px]  lg:w-[404px] lg:h-[265px] overflow-hidden "
//                                 alt=""
//                                 src={reviews[currentIndex].img}
//                             />
//                         </motion.div>
//                     </div> */}

//                     {/* review section  */}
//                     <div className="w-full text-center justify-center items-center lg:col-span-4">
//                         <motion.div
//                             // initial={{ x: +1000 }}
//                             // animate={{ x: [900, 0] }}
//                             animate={mainControlsReview}
//                             transition={{ duration: 2, delay: 0.2 }}
//                             whileHover={{ scale: 0.95, opacity: 0.9 }}
//                         >
//                             <div className="mx-10 mb-10 font-light text-left justify-center items-center text-20xl sm:text-21xl lg:pt-16">
//                                 {reviews[currentIndex].heading}
//                             </div>
//                             <div className="mx-10 text-5xl font-light text-left justify-center items-center ">
//                                 {reviews[currentIndex].review}
//                             </div>
//                             {/* <div className="items-center mx-10 mt-10 text-5xl font-yeseva-one">
//                                 {reviews[currentIndex].name}
//                             </div>

//                             <div className="items-center mx-10 mt-4 text-base2 text-background-black-fade-font ">
//                                 {reviews[currentIndex].post_name}
//                             </div> */}
//                         </motion.div>
//                         {/* review footer dots to change review   */}

//                         <div className="flex justify-center py-2 pt-5 top-4 lg:pt-10">
//                             {reviews.map((review, reviewIndex) => (
//                                 <div
//                                     key={reviewIndex}
//                                     onClick={() => goToReview(reviewIndex)}
//                                     className="text-2xl cursor-pointer"
//                                 >
//                                     <Dot className="size-12" />
//                                 </div>
//                             ))}
//                         </div>

//                         {/* left right arrow */}
//                         {/* <div className="hidden group-hover:lg:block absolute top-[50%] -translate-x-0 translate-y-[-70%] left-5 text-2xl rounded-full p-2 bg-orange-button text-white cursor-pointer">
//               <BsChevronCompactLeft onClick={prevReview} size={30} />
//             </div>
//             <div className="hidden group-hover:lg:block absolute top-[50%] -translate-x-0 translate-y-[-70%] right-5 text-2xl rounded-full p-2 bg-orange-button text-white cursor-pointer">
//               <BsChevronCompactRight onClick={nextReview} size={30} />
//             </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewSection;

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ReviewSection = () => {
  // Storing the reviews
  const reviews = [
    {
      id: 1,
      heading: 'Affordable Housing - Non-Convertible Debentures (NCDs)',
      review:
        'Altern8’s NCD facility helped us raise capital swiftly for our affordable housing project. They understood our project’s potential and provided the much needed boost to expand in underserved markets. The team’s professionalism and quick response made a real difference.They made us realise our infrastructure status and facilitated international investors as well.',
      name: 'Lalit Jaiswal',
      post_name: 'Landcraft',
      // img: '/logitechseeklogocom2-1.svg',
    },
    {
      id: 2,
      heading: 'Retirement Communities - Compulsory Convertible Debentures(CCDs)',
      review:
        'With a growing demand for retirement communities in smaller cities, we approached Altern8 for CCD financing. Their structured approach provided us with a flexible repayment model, perfectly matching our cash flow needs. Thanks to Altern8, our retirement community project is now thriving.',
      name: 'Rakesh Garg,',
      post_name: 'Carol',
      // img: '/logitechseeklogocom2-1.svg',
    },
    {
      id: 3,
      heading: 'Residential Townships - Commercial Paper',
      review:
        'Altern8’s commercial paper financing enabled us to develop a large residential township efficiently. The entire team was responsive, and the process was simple yet thorough. This form of financing was just what we needed to kickstart construction and stay ahead of timelines.',
      name: 'Vaibhav Jain,',
      post_name: 'Rise Developers',
      // img: '/logitechseeklogocom2-1.svg',
    },
    {
      id: 4,
      heading: 'Commercial Properties - Non-Convertible Debentures (NCDs)',
      review:
        'For our commercial property project, Altern8’s NCD funding offered flexibility and solid terms that helped us stay on track financially. Their expertise in handling the financing needs of smaller developers like us has been a game changer.',
      name: 'Harmandeep Singh,',
      post_name: 'Harmony',
      // img: '/logitechseeklogocom2-1.svg',
    },
    {
      id: 5,
      heading: 'Agricultural Land Developments - Debentures',
      review:
        'Altern8’s debenture issuance made financing our agricultural development possible. The team’s attention to detail and understanding of our unique project needs set them apart. This financing has allowed us to expand and offer sustainable land options to our community.',
      name: 'Yash Garg',
      post_name: ' ',
      // img: '/logitechseeklogocom2-1.svg',
    },
    {
      id: 6,
      heading: 'Apartments - Secured Notes',
      review:
        'Secured notes via Altern8 provided the perfect funding solution for our mid sized apartment project in Ghaziabadn. The simplicity and transparency of the process were refreshing, and we could access the funds without any delays.',
      name: 'Sajal Garg',
      post_name: 'Insprosper Promoters',
      // img: '/logitechseeklogocom2-1.svg',
    }
  ];

  // Duplicate the reviews for continuous scrolling
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Go to last review
  const prevReview = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? duplicatedReviews.length - 3 : prevIndex - 3;
      return newIndex;
    });
  };

  // Function to go to the next review
  const nextReview = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + 3) % duplicatedReviews.length;
      return newIndex;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextReview();
    }, 4000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Framer motion for animation on scroll
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControlsReview = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Fire the animation
      mainControlsReview.start({ x: [100, 0] });
    }
  }, [isInView]);

  return (
    <div className="w-full mx-auto pt-10 text-white font-work-sans text-center">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3 ">
        {duplicatedReviews.slice(currentIndex, currentIndex + 3).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ x: 100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }} 
            transition={{ duration: 0.5 }} 
            whileHover={{ scale: 0.95, opacity: 0.9 }}
          >
            <div className="mx-10 mb-6 font-light justify-center text-center items-center md:text-[15px] sm:text-21xl lg:pt-16">
              {/* {reviews[currentIndex].heading}{' '} */}
              {review.heading}
            </div>
            <div className="mb-4 text-sm font-light">{review.review}</div>
            <div className="mt-4 font-semibold text-xl">{review.name || 'Anonymous'}</div>
            <div className="text-sm text-gray-600">{review.post_name || 'Position'}</div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-between w-[85%] m-auto">
        <button
          onClick={prevReview}
          className="flex items-center justify-center hover:bg-[#762559] rounded-full h-10 w-10 text-gray-500 hover:text-white"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextReview}
          className="flex items-center justify-center hover:bg-[#762559] rounded-full h-10 w-10 text-gray-500 hover:text-white"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
