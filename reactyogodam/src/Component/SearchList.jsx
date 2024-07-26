import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axios';
import '../css/Category.css';

const SearchList = () => {
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const search = new URLSearchParams(location.search).get('search');
        console.log('검색어:', search);

        axios.get('http://localhost:8000/list/searchlist', {
            params: { search }
        })
        .then(response => {
            const searchItems = response.data.map(item => ({
                id: item.FOOD_ID,
                title: item.FOOD_NAME,
                img: item.FOOD_IMG ? `data:image/jpg;base64,${item.FOOD_IMG}` : null,
                notification: item.NOTIFICATION,
                price: item.FOOD_PRICE
            }));
            setSearchList(searchItems);
            setLoading(false);
        })
        .catch(error => {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            setLoading(false);
        });
    }, [location.search]);

    const handleProductClick = (id) => {
        navigate(`/recipeDetail/${id}`);
    };

    return (
        <div className="search-list-container">
            {loading ? (
                <p>로딩 중...</p>
            ) : searchList.length > 0 ? (
                searchList.map((food, index) => (
                    <div className="product-card" key={food.id} onClick={() => handleProductClick(food.id)}>
                        <div className="product-rank">{index + 1}</div>
                        {food.img ? (
                            <img className="product-img" src={food.img} alt={food.title} />
                        ) : (
                            <div className="no-image">이미지 없음</div>
                        )}
                        <div className="product-info">
                            <h2>{food.title}</h2>
                            <p>{food.notification}</p>
                            <p className="product-price">{food.price} 원</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default SearchList;
