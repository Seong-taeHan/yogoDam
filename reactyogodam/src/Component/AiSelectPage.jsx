import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../css/aiselectpage.css';

import { Navigation, Pagination } from 'swiper/modules';

const AiSelectPage = () => {
    const [slides, setSlides] = useState([]);
    const [loop, setLoop] = useState(false);
    const navigate = useNavigate();

    const randomLecipe = [
        {name : '김치찌개'},
        {name : '어묵김말이'},
        {name : '돈가스'},
        {name : '떡볶이'},
        {name : '제육볶음'}
    ]

    useEffect(() => {
        axios.get('http://localhost:5000/recommend')
            .then(response => {
                const formattedSlides = response.data.map((item, index) => ({
                    img: '/img/aicategory/aifolder.png',
                    text: `${item.이름}`,
                    data: item
                }));
                setSlides(formattedSlides);
                setLoop(formattedSlides.length > 1);

                const randomSlides = formattedSlides.sort(() => 0.5 - Math.random()).slice(0, 5);
                console.log("랜덤으로 선택된 5개 메뉴:", randomSlides.map(slide => slide.text));
                setSlides(randomSlides);
            })
            .catch(error => {
                console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
            });
    }, []);

    const handleSlideClick = (slide) => {
        navigate('/airesult', { state: { recipe: slide.data } });
    };

    return (
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
                    loop={loop}
                >
                    {/* {slides.map((slide, index) => (
                        <SwiperSlide key={index} onClick={() => handleSlideClick(slide)}>
                            <div className="aiselect-slide-content">
                                <img src={slide.img} alt={slide.text} className="aiselect-slide-image" />
                                <div className="aiselect-slide-text">{slide.text}</div>
                            </div>
                        </SwiperSlide>
                    ))} */}
                    {/* 이 아래는 테스트 데이터 입니다 */}
                    {randomLecipe.map((recipe, index) => (
                        <SwiperSlide key={index} onClick={() => handleSlideClick(recipe)}>
                            <div className="aiselect-slide-content">
                                <img src="/img/aicategory/aifolder.png" alt={recipe.name} className="aiselect-slide-image" />
                                <div className="aiselect-slide-text">{recipe.name}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="aiselect-footer">
                <div className='aiselect-sbtitle-align'>
                    <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="aiselect-Image" />
                </div>
            </div>
        </div>
    );
}

export default AiSelectPage;