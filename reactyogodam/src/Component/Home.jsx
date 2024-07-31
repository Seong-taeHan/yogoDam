import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import BannerSlide from './BannerSlide';
import '../css/home.css';

const Home = () => {
    const images = ['/img/bannerImg/banner1.png', '/img/bannerImg/banner2.png', '/img/bannerImg/banner3.png'];
    const intervalTime = 3000; // 3초

    const [cardInfoList, setCardInfoList] = useState([]);
    const [bookmarks, setBookmarks] = useState({});
    const [activeTab, setActiveTab] = useState('popular'); // 현재 활성화된 탭
    const [page, setPage] = useState(1); // 현재 페이지 번호
    const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부
    const observer = useRef();

    const user_id = localStorage.getItem('user_id');
    const navigate = useNavigate();

    const lastCardElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const url = activeTab === 'popular'
                    ? `http://localhost:8000/list/lecipes/pop?page=${page}`
                    : `http://localhost:8000/list/lecipes?page=${page}`;
                const response = await axios.get(url);
                const lecipes = response.data.map(item => ({
                    id: item.FOOD_ID,
                    name: item.FOOD_NAME,
                    img: item.FOOD_IMG ? `data:image/jpg;base64,${item.FOOD_IMG}` : null,
                    price: item.FOOD_PRICE,
                    nickName: item.NICK_NAME,
                    content: item.NOTIFICATION,
                    popularity: item.POPULARITY,
                    totalPrice: item.TOTAL_PRICE // 총 가격
                }));

                console.log(lecipes); // 데이터를 콘솔에 출력하여 확인

                setCardInfoList(prevCardInfoList => {
                    const newList = [...prevCardInfoList];
                    lecipes.forEach(newItem => {
                        if (!newList.find(item => item.id === newItem.id)) {
                            newList.push(newItem);
                        }
                    });
                    return newList;
                });
                setHasMore(lecipes.length > 0);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchRecipes();
    }, [page, activeTab]);

    useEffect(() => {
        if (user_id) {
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
        }
    }, [user_id]);

    const toggleBookmark = async (id, e) => {
        e.stopPropagation();
        if (!user_id) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await axios.post('http://localhost:8000/list/favorites/toggle', {
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

    const handleTabChange = (tab) => {
        if (activeTab === tab) return; // 현재 활성화된 탭이 클릭된 경우 아무 작업도 하지 않음
        setActiveTab(tab);
        setPage(1);
        setCardInfoList([]);
        setHasMore(true);
    };

    return (
        <div className='home-container'>
            <div>
                <BannerSlide images={images} intervalTime={intervalTime} />
            </div>
            <div className="tab-container">
                <div className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
                    onClick={() => handleTabChange('popular')}
                    style={{ pointerEvents: activeTab === 'popular' ? 'none' : 'auto' }}>
                    인기순
                </div>
                <div className={`tab ${activeTab === 'latest' ? 'active' : ''}`}
                    onClick={() => handleTabChange('latest')}
                    style={{ pointerEvents: activeTab === 'latest' ? 'none' : 'auto' }}>
                    최신순
                </div>
            </div>
            <div className="products-container">
                {cardInfoList.map((product, index) => {
                    const productCard = (
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
                                        onClick={(e) => toggleBookmark(product.id, e)}
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
                                                <p>{product.popularity}</p>
                                            </div>
                                            <div className="product-views">
                                                <img className='search_icon' src="../img/icon/search.svg" alt="search" />
                                                <p>2964</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="product-price">총 가격: {product.totalPrice} 원</p> {/* 총 가격 표시 */}
                                </div>
                            </div>
                        </div>
                    );

                    if (index === cardInfoList.length - 1) {
                        return (
                            <div ref={lastCardElementRef} key={product.id}>
                                {productCard}
                            </div>
                        );
                    } else {
                        return productCard;
                    }
                })}
            </div>
        </div>
    );
};

export default Home;