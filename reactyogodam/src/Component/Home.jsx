import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BannerSlide from './BannerSlide';
import '../css/home.css';

const Home = () => {
    const images = ['/img/testImg/groundImg.png', '/img/testImg/totoro1.png', '/img/testImg/test1.png'];
    const intervalTime = 3000; // 3초

    const [cardInfoList, setCardInfoList] = useState([]);
    const [activeTab, setActiveTab] = useState('popular'); // 현재 활성화된 탭

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/list/products')
            .then(response => {
                const products = response.data.map(item => ({
                    id: item.FOOD_ID,
                    name: item.FOOD_NAME,
                    img: `data:image/jpeg;base64,${item.FOOD_IMG}`,
                    price: item.FOOD_PRICE,
                    content: item.CUSINE_TYPE,
                }));
                setCardInfoList(products);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    const handleProductClick = (id) => {
        navigate(`/lecipeDetail/${id}`);
    };

    return (
        <div className='home-container'>
            <div>
                <BannerSlide images={images} intervalTime={intervalTime}></BannerSlide>
            </div>
            <div className="tab-container">
                <div className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => setActiveTab('popular')}>
                    인기순
                </div>
                <div className={`tab ${activeTab === 'latest' ? 'active' : ''}`}
                    onClick={() => setActiveTab('latest')}>
                    최신순
                </div>
            </div>
            <div>
                {cardInfoList.map((product, index) => (
                    <div className="product-card" key={product.id} onClick={() => handleProductClick(product.id)}>
                        <div className="product-rank">{index + 1}</div>
                        <img className="product-img" src={product.img} alt={product.name} />
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
