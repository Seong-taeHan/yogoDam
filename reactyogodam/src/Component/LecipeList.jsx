import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/cardList.css'

const LecipeList = () => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // 초기 데이터 설정
        const products = [
            { id: 1, name: "상품1", price: 1000, content: "특급1입니다", likes: 300 },
            { id: 2, name: "상품2", price: 2000, content: "상품2입니다", likes: 400 },
            { id: 3, name: "상품3", price: 3000, content: "상품3입니다", likes: 500 },
            { id: 4, name: "상품4", price: 3000, content: "상품3입니다", likes: 100 },
            { id: 5, name: "상품5", price: 3000, content: "상품3입니다", likes: 300 },
            { id: 6, name: "상품6", price: 3000, content: "상품3입니다", likes: 200 }
        ];

        setCardInfoList(products);
    }, []);

    useEffect(() => {
        // URL 파라미터에서 검색어 추출
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search') || '';

        // 검색어에 따른 필터링
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = cardInfoList.filter(product =>
            product.content.toLowerCase().includes(lowercasedQuery)
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
                    filteredList.map((product, index) => (
                        <div className="product-card" key={product.id} onClick={() => handleProductClick(product.id)}>
                            <div className="product-rank">{index + 1}</div>
                            <img className="product-img" src={product.img} alt={product.name} />
                            <div className="product-info">
                                <h2>{product.name}</h2>
                                <p>{product.content}</p>
                                <p className="product-price">{product.price.toLocaleString()} 원</p>
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