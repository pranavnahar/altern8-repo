import React from "react";
import Slider from "react-slick";
// 
import "./slick-overrides.css";

import Image from "next/image";
import { images } from "./Logos";

const ImageSlider = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrow:false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  return (
    <div className="imageSliderContainer">
      <Slider {...settings} >
        {images.map((image, index) => (
          <div key={index} className="pl-24 imageSlide">
            <div className="imageWrapper">
              <Image
                src={`/borrowerFlowLogos/${image}`}
                alt={`Slide ${index}`}
                layout="intrinsic"
                width={100} // Adjust width as needed
                height={100} // Adjust height as needed
                objectFit="contain"
                className="image border border-white rounded-md"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
