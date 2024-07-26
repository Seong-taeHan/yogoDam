import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 모듈 올바르게 불러오기
import '../css/Category.css';

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const category = new URLSearchParams(window.location.search).get('category'); // URL에서 카테고리 파라미터 가져오기

        axios.get('http://localhost:8000/list/categorylist', {
            params: { category }
        })
        .then(response => {
            const categoryItems = response.data.map(item => ({
                id: item.FOOD_ID,
                title: item.FOOD_NAME,
                img: item.FOOD_IMG ? `data:image/jpg;base64,${item.FOOD_IMG}` : null,
                notification: item.NOTIFICATION,
                price: item.FOOD_PRICE
            }));
            setCategoryList(categoryItems);
        })
        .catch(error => {
            console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
        });
    }, []);

    const handleProductClick = (id) => {
        navigate(`/lecipeDetail/${id}`);
    };

    return (
        <div>
            <div>
                {categoryList.length > 0 ? (
                    categoryList.map((food, index) => (
                        <div className="product-card" key={food.id} onClick={() => handleProductClick(food.id)}>
                            <div className="product-rank">{index + 1}</div>
                            <img className="product-img" src={food.img} alt={food.title} />
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
        </div>
    );
};

export default CategoryList;
