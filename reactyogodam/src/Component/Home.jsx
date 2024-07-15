import React from 'react';
import { useEffect, useState } from 'react'
import BannerSlide from './BannerSlide';
import '../css/home.css';
import sampleImg from '../img/sample.png'; // 이미지 import

const Home = () => {

    const images = ['/img/testImg/groundImg.png', '/img/testImg/totoro1.png', '/img/testImg/test1.png'];
    //const images = ['img1.png', 'img2.png', 'img1.png'];
    const intervalTime = 3000; // 3초

    const [cardInfoList, setCardInfoList] = useState([]);
    const [activeTab, setActiveTab] = useState('popular'); // 현재 활성화된 탭

    const products = [
        { id: 1, name: "상품1", img:images, price: 1000, content: "상품1입니다" },
        { id: 2, name: "상품2", img:images, price: 2000, content: "상품2입니다" },
        { id: 3, name: "상품3", img:images, price: 3000, content: "상품3입니다" },
        { id: 4, name: "상품4", img:images, price: 3000, content: "상품3입니다" },
        { id: 5, name: "상품5", img:images, price: 3000, content: "상품3입니다" },
        { id: 6, name: "상품6", img:images, price: 3000, content: "상품3입니다" }
    ];

    useEffect(() => {
        setCardInfoList(products);
    }, [])

    return (
        <div className='home-container'>
            <div>
                <BannerSlide images={images} intervalTime={intervalTime}></BannerSlide>
            </div>
            <div className="tab-container">
                <div
                    className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => setActiveTab('popular')}
                >
                    인기순
                </div>
                <div
                    className={`tab ${activeTab === 'latest' ? 'active' : ''}`}
                    onClick={() => setActiveTab('latest')}
                >
                    최신순
                </div>
            </div>
            <div>
                {cardInfoList.map((product, index) => (
                    <div className="product-card" key={product.id}>
                        <div className="product-rank">{index + 1}</div>
                        <img className="product-img" src={product.img[0]} alt={product.name} />
                        <div className="product-info">
                            <h2>{product.name}</h2>
                            <p>{product.content}</p>
                            <p className="product-price">{product.price.toLocaleString()} 원</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
);
}

export default Home;    