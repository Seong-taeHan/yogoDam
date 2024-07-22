import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LecipeDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(0);

    useEffect(() => {
        const products = [
            { id: 1, name: "상품1", price: 1000, content: "특급1입니다", thumbnail: "썸네일1.png" },
            { id: 2, name: "상품2", price: 2000, content: "상품2입니다", thumbnail: "썸네일2.png" },
            { id: 3, name: "상품3", price: 3000, content: "상품3입니다", thumbnail: "썸네일3.png" },
            { id: 4, name: "상품4", price: 4000, content: "상품4입니다", thumbnail: "썸네일4.png" },
            { id: 5, name: "상품5", price: 6000, content: "상품5입니다", thumbnail: "썸네일5.png" },
            { id: 6, name: "상품6", price: 5000, content: "상품6입니다", thumbnail: "썸네일6.png" }
        ];
    
        const product = products.find(p => p.id === parseInt(id));
        setProduct(product);
    }, [id]);


  return (
    <div>
        <img src={product.thumbnail} alt={product.id}></img>
        {/* 레시피 제목 */}
        <h1>{product.name}</h1>
        {/* 레시피 부연 설명 */}
        <p>{product.content}</p>
        <h2>재료</h2>
        <h3>식자재</h3>
        <h3>양념</h3>

        {/* 반복 시작 */}
        <h2>조리순서</h2>
        <p>부연 설명</p>
        {/* 반복 끝 */}
    </div>
  )
}

export default LecipeDetail