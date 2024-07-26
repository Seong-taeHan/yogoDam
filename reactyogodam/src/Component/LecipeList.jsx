import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import '../css/cardList.css';

const LecipeList = () => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:8000/list/lecipes')
            .then(response => {
                console.log("DB 데이터 응답 확인 : ", response.data);
                setCardInfoList(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    useEffect(() => {
        // Extract nickname and search query from URL parameters
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';
        const nickName = queryParams.get('nick_name') || '';

        // Filter based on search query and nickname
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = cardInfoList.filter(food =>
            food.FOOD_NAME && food.FOOD_NAME.toLowerCase().includes(lowercasedQuery) &&
            food.NICK_NAME && food.NICK_NAME === nickName
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
                            <img className="product-img" src={food.FOOD_IMG ? `data:image/jpg;base64,${food.FOOD_IMG}` : null} alt={food.FOOD_NAME} />
                            <div className="product-info">
                                <h2>{food.FOOD_NAME}</h2>
                                <p>{food.NOTIFICATION}</p>
                                <p className="product-price">{food.FOOD_PRICE} 원</p>
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