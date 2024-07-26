import React, { useState, useEffect } from 'react';
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
                    <div className="banner-slide-item" key={index}>
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
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

export default BannerSlide;