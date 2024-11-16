import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from './Customcarousel';



const ImageCarousel = ({ images }) => {

 

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: (images.length !== 1 && images.length !== 0) ? <NextArrow /> : null,  // Correct usage
    prevArrow: (images.length !== 1 && images.length !== 0) ? <PrevArrow /> : null,  // Correct usage
  };

  return (
    <div style={{ width: "70%", margin: "0 auto" }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image.name}
              alt={`Slide ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageCarousel;
