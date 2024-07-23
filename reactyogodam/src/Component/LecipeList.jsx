import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/cardList.css';

const LecipeList = () => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 백엔드에서 데이터 가져오기
        axios.get('http://localhost:8000/list/products')
            .then(response => {
                console.log("DB 데이터 응답 확인 : ", response.data);
                setCardInfoList(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    useEffect(() => {
        // URL 파라미터에서 검색어 추출
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';

        // 검색어에 따른 필터링
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = cardInfoList.filter(food =>
            food.FOOD_NAME && food.FOOD_NAME.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredList(filtered);
    }, [location.search, cardInfoList]);

    const handleProductClick = (id) => {
        navigate(`/lecipeDetail/${id}`);
    };

    return (
        <div>
            <div>
                {filteredList.length > 0 ? (
                    filteredList.map((food, index) => (
                        <div className="product-card" key={food.FOOD_ID} onClick={() => handleProductClick(food.FOOD_ID)}>
                            <div className="product-rank">{index + 1}</div>
                            <img className="product-img" src={food.FOOD_IMG} alt={food.FOOD_NAME} />
                            <div className="product-info">
                                <h2>{food.FOOD_NAME}</h2>
                                <p>{food.COOKING_METHOD}</p>
                                <p className="product-price">{food.FOOD_PRICE.toLocaleString()} 원</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default LecipeList;
