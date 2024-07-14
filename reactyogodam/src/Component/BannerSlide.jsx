import React from 'react'
import { useState, useEffect } from 'react'
import '../css/bannerSlide.css';

const BannerSlide = ({ images, intervalTime }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentIdx((prevIdx) => (prevIdx + 1) % images.length);
      }, intervalTime);
  
      return () => clearInterval(intervalId);
    }, [images.length, intervalTime]);
  
    return (
      <div className="banner-container">
        <div
          className="banner-slide"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
        >
          {images.map((image, index) => (
            <img src={image} alt={`Slide ${index}`} key={index} />
          ))}
        </div>
        <div className="dots">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentIdx ? 'active' : ''}`}
              onClick={() => setCurrentIdx(index)}
            ></div>
          ))}
        </div>
      </div>
    );
  };

export default BannerSlide