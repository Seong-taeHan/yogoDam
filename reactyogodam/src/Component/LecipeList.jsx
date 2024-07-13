import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LecipeList = () => {
    const [cardInfoList, setCardInfoList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // 초기 데이터 설정
        const products = [
            { id: 1, name: "상품1", price: 1000, content: "특급1입니다" },
            { id: 2, name: "상품2", price: 2000, content: "상품2입니다" },
            { id: 3, name: "상품3", price: 3000, content: "상품3입니다" },
            { id: 4, name: "상품4", price: 3000, content: "상품3입니다" },
            { id: 5, name: "상품5", price: 3000, content: "상품3입니다" },
            { id: 6, name: "상품6", price: 3000, content: "상품3입니다" }
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

    return (
        <div>
            <div>
                {filteredList.length > 0 ? (
                    filteredList.map(product => (
                        <div key={product.id}>
                            <h2>{product.name}</h2>
                            <p>{product.content}</p>
                            <p>가격: {product.price}원</p>
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