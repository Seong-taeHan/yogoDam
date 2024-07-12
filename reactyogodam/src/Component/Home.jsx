import React, { useEffect, useState } from 'react'

const Home = () => {

    const [cardInfoList, setCardInfoList] = useState([]);

    useEffect(() => {
        const products = [
            { id: 1, name: "상품1", price: 1000, content: "상품1입니다" },
            { id: 2, name: "상품2", price: 2000, content: "상품2입니다" },
            { id: 3, name: "상품3", price: 3000, content: "상품3입니다" },
            { id: 4, name: "상품4", price: 3000, content: "상품3입니다" },
            { id: 5, name: "상품5", price: 3000, content: "상품3입니다" },
            { id: 6, name: "상품6", price: 3000, content: "상품3입니다" }

        ];

        setCardInfoList(products);
    }, [])

  return (
    <div>
        <div>배너</div>
        <div>
        {cardInfoList.map(product => (
                <div key={product.id}>
                <h2>{product.name}</h2>
                <p>{product.content}</p>
                <p>가격: {product.price}원</p>
            </div>
        ))}
        </div>
    </div>
  )
}

export default Home