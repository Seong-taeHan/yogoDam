import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/aiselectpage.css';

import { Navigation, Pagination } from 'swiper/modules';

const slides = [
    { img: '/img/aicategory/aifolder.png', text: '추천 요리 1' },
    { img: '/img/aicategory/aifolder.png', text: '추천 요리 2' },
    { img: '/img/aicategory/aifolder.png', text: '추천 요리 3' },
    { img: '/img/aicategory/aifolder.png', text: '추천 요리 4' }
];

const AiSelectPage = () => {
    return (
        <div>
            <div className="aiselect-container">
                <div className="aiselect-TopBar">추천 AI</div>
                <div className="aiselect-Content">
                    <div className="aiselect-Text">여러 요리를 추천해 드릴게요!</div>
                    <Swiper
                        className="aiselect-swiper"
                        modules={[Navigation, Pagination]}
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div className="aiselect-slide-content">
                                    <img src={slide.img} alt={slide.text} className="aiselect-slide-image" />
                                    <div className="aiselect-slide-text">{slide.text}</div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div>
                    <div className='aiselect-sbtitle-align'>
                        <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="aiselect-Image" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AiSelectPage;