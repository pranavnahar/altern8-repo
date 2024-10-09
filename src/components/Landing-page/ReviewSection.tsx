// reviews section for landing page

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Dot } from 'lucide-react';

const ReviewSection = () => {
    // storing the reviews
    const reviews = [
        {
            id: 1,
            heading:
                '“Exceptional funding website! User-friendly interface, robust features, prompt customer support',
            review:
                "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. ”",
            name: 'Raghav Sharma',
            post_name: 'Managing Director, logitech',
            img: '/logitechseeklogocom2-1.svg',
        },
        {
            id: 2,
            heading:
                '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-2',
            review:
                "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. 2”",
            name: 'Raghav Sharma',
            post_name: 'Managing Director, logitech',
            img: '/logitechseeklogocom2-1.svg',
        },
        {
            id: 3,
            heading:
                '“Exceptional funding website! User-friendly interface, robust features, prompt customer support review-3',
            review:
                "Simplified fundraising with diverse options. Highly recommended for seamless financial support and project success. A valuable resource for individuals and organizations alike, making the funding journey efficient and rewarding. The platform's transparency and security instill confidence, fostering a positive experience for both fundraisers and contributors. 3”",
            name: 'Raghav Sharma',
            post_name: 'Managing Director, logitech',
            img: '/logitechseeklogocom2-1.svg',
        },
    ];
    //  for reviews
    const [currentIndex, setCurrentIndex] = useState(0);

    // go to last review
    const prevReview = () => {
        const isFirstReview = currentIndex === 0;
        const newIndex = isFirstReview ? reviews.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    // Function to go to the next review
    const nextReview = () => {
        setCurrentIndex(prevIndex => {
            const isLastReview = prevIndex === reviews.length - 1;
            return isLastReview ? 0 : prevIndex + 1;
        });
    };

    // useEffect to call nextReview every second
    useEffect(() => {
        // Set up an interval that calls nextReview every 2000 milliseconds (2 seconds)
        const intervalId = setInterval(() => {
            nextReview();
        }, 4000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures that the effect runs only once (on mount)

    // for review scroll dots
    //   @ts-ignore
    const goToReview = reviewIndex => {
        setCurrentIndex(reviewIndex);
    };

    // framer motion , animation on scroll
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();
    const mainControlsReview = useAnimation();

    useEffect(() => {
        if (isInView) {
            // fire the  animation
            mainControls.start({ x: [-900, 0] });
            mainControlsReview.start({ x: [900, 0] });
        }
    }, [isInView]);

    return (
        <div className="w-full group">
            <div className="container justify-center max-w-[1340px] mx-auto pt-10 text-white-font font-work-sans group">
                <div className="relative box-border mx-7    h-[3px] border-t-[3px] border-solid border-white-font" />
                <div />
                <div className="max-w-[1320px] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-6 ">
                    <div ref={ref} className="lg:col-span-2">
                        {/* animation  */}
                        <motion.div
                            initial={{ x: -1000 }}
                            // animate={{ x: [-900, 0] }}
                            animate={mainControls}
                            transition={{ duration: 2, delay: 0.2 }}
                            whileHover={{ scale: 0.95, opacity: 0.9 }}
                        >
                            {/*review company logo image  */}
                            <img
                                className="w-[250px] h-[150px] px-10  sm:w-[350 px] sm:h-[130px]  lg:w-[404px] lg:h-[265px] overflow-hidden "
                                alt=""
                                src={reviews[currentIndex].img}
                            />
                        </motion.div>
                    </div>

                    {/* review section  */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ x: +1000 }}
                            // animate={{ x: [900, 0] }}
                            animate={mainControlsReview}
                            transition={{ duration: 2, delay: 0.2 }}
                            whileHover={{ scale: 0.95, opacity: 0.9 }}
                        >
                            <div className="mx-10 mb-10 font-light text-left text-20xl sm:text-21xl lg:pt-16">
                                {reviews[currentIndex].heading}
                            </div>
                            <div className="mx-10 text-5xl font-light text-left ">
                                {reviews[currentIndex].review}
                            </div>
                            <div className="items-center mx-10 mt-10 text-5xl font-yeseva-one">
                                {reviews[currentIndex].name}
                            </div>

                            <div className="items-center mx-10 mt-4 text-base2 text-background-black-fade-font ">
                                {reviews[currentIndex].post_name}
                            </div>
                        </motion.div>
                        {/* review footer dots to change review   */}

                        <div className="flex justify-center py-2 pt-5 top-4 lg:pt-10">
                            {reviews.map((review, reviewIndex) => (
                                <div
                                    key={reviewIndex}
                                    onClick={() => goToReview(reviewIndex)}
                                    className="text-2xl cursor-pointer"
                                >
                                    <Dot className="size-12" />
                                </div>
                            ))}
                        </div>

                        {/* left right arrow */}
                        {/* <div className="hidden group-hover:lg:block absolute top-[50%] -translate-x-0 translate-y-[-70%] left-5 text-2xl rounded-full p-2 bg-orange-button text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevReview} size={30} />
            </div>
            <div className="hidden group-hover:lg:block absolute top-[50%] -translate-x-0 translate-y-[-70%] right-5 text-2xl rounded-full p-2 bg-orange-button text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextReview} size={30} />
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
