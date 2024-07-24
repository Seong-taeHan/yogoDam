import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerSlide from './BannerSlide';
import axios from '../axios';
import '../css/home.css';

const Home = () => {

    const images = ['/img/testImg/groundImg.png', '/img/testImg/totoro1.png', '/img/testImg/test1.png'];
    const intervalTime = 3000; // 3초

    const [cardInfoList, setCardInfoList] = useState([]);
    const [bookmarks, setBookmarks] = useState({});
    const [activeTab, setActiveTab] = useState('popular'); // 현재 활성화된 탭
    const user_id = localStorage.getItem('user_id');
    

    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get('http://localhost:8000/list/lecipes')
            .then(response => {
                const lecipes = response.data.map(item => ({
                    id: item.FOOD_ID,
                    name: item.FOOD_NAME,
                    img: item.FOOD_IMG ? `data:image/jpg;base64,${item.FOOD_IMG}` : null,
                    price: 0, //item.FOOD_PRICE,
                    nickName : item.NICK_NAME,
                    content: item.NOTIFICATION
                }));
                console.log(lecipes);
                setCardInfoList(lecipes);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/list/favorites', {
            params: {
                user_id: user_id // 실제 사용자 ID를 사용
            }
        })
        .then(response => {
            const favorites = response.data.reduce((acc, food_id) => {
                acc[food_id] = true;
                return acc;
            }, {});
            setBookmarks(favorites);
        })
        .catch(error => {
            console.error('즐겨찾기 데이터 불러오기 오류:', error);
        });
    }, []);

    const toggleBookmark = async (id) => {
        try {
            const response = await axios.post('http://localhost:8000/list/favorites/toggle', {
                user_id: user_id, // 실제 사용자 ID를 사용
                food_id: id
            });
            setBookmarks(prevBookmarks => ({
                ...prevBookmarks,
                [id]: !prevBookmarks[id]
            }));
        } catch (error) {
            console.error('즐겨찾기 상태 변경 오류:', error);
        }
    };

    const handleProductClick = (id) => {
        navigate(`/lecipeDetail/${id}`);
    };

    return (
        <div className='home-container'>
            <div>
                <BannerSlide images={images} intervalTime={intervalTime} />
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
            <div className="products-container">
                {cardInfoList.map((product, index) => (
                    <div className="product-card" onClick={() => handleProductClick(product.id)} key={product.id}>
                        <div className="product-rank">{index + 1}</div>
                        <img className="product-img" src={product.img} alt={product.name} />
                        <div className="product-info">
                            <div className="product-header">
                                <h2>{product.name}</h2>
                                <img 
                                    className='bookmark_icon' 
                                    src={bookmarks[product.id] ? "../img/icon/bookmarked.svg" : "../img/icon/bookmark.svg"} 
                                    alt="bookmark" 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        toggleBookmark(product.id);
                                    }}
                                />
                            </div>
                            <div>{product.content}</div>
                            <div className="product-body">
                                <div className="product-details">
                                    <div className="product-user">
                                        <img className="user_icon" src="../img/icon/User.svg" alt="user" />
                                        <p>{product.nickName}</p>
                                    </div>
                                    <div className="product-stats">
                                        <div className="product-rating">
                                            <img className='star_icon' src="../img/icon/star.svg" alt="star" />
                                            <p>5.0</p>
                                        </div>
                                        <div className="product-views">
                                            <img className='search_icon' src="../img/icon/search.svg" alt="search" />
                                            <p>2964</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="product-price">{product.price.toLocaleString()} 원</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;