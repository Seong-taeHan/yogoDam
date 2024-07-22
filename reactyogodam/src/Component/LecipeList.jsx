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
        // 백엔드에서 데이터 가져오기
        fetch('http://localhost:8000/list/products')
            .then(response => response.json())
            .then(data => setCardInfoList(data))
            .catch(error => console.error('Error fetching products:', error));
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