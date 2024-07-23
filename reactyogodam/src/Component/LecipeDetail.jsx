import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/LecipeDetail.css';

const LecipeDetail = () => {
    const products = [
      { id: 1, name: "백선생 레시피, 겉은 바삭 속은 쫀득한 감자채전 만들기1", price: 50000, content: "1늘 똑같은 감자전에 지겨우시다면 감자채전으로 어떠세요?", thumbnail: "썸네일.png", calories: 279 },
      { id: 2, name: "백선생 레시피, 겉은 바삭 속은 쫀득한 감자채전 만들기2", price: 50000, content: "2늘 똑같은 감자전에 지겨우시다면 감자채전으로 어떠세요?", thumbnail: "썸네일.png", calories: 279 },
      { id: 3, name: "백선생 레시피, 겉은 바삭 속은 쫀득한 감자채전 만들기3", price: 50000, content: "3늘 똑같은 감자전에 지겨우시다면 감자채전으로 어떠세요?", thumbnail: "썸네일.png", calories: 279 },
    ];

    return (
        <div className='LecipeDetail_container'>
            <div className='lp_container'>
                <div className='image-placeholder'>
                    <img src={products.thumbnail} alt={products.name} />
                </div>
                <h1>{products.name}</h1>
                <p>{products.content}</p>
                <div className='tags'>
                    <span className='tag'>2인분</span>
                    <span className='tag'>10분 이내</span>
                    <span className='tag'>초급요리</span>
                </div>
                <h2>재료</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>중간크기 감자</td>
                            <td>2개</td>
                            <td>10,000원</td>
                        </tr>
                        <tr>
                            <td>소금</td>
                            <td>1/2티스푼</td>
                            <td>10,000원</td>
                        </tr>
                        <tr>
                            <td>부침가루</td>
                            <td>1.5큰술</td>
                            <td>10,000원</td>
                        </tr>
                        <tr>
                            <td>후추</td>
                            <td>약간</td>
                            <td>10,000원</td>
                        </tr>
                        <tr>
                            <td>식용유</td>
                            <td>넉넉하게</td>
                            <td>10,000원</td>
                        </tr>
                    </tbody>
                </table>
                <div className='summary'>
                    <span>{products.calories} kcal</span>
                    <span>합계 {products.price} 원</span>
                </div>
                <h2>요리순서</h2>
                <div className='instructions'>
                    <p>1. 먼저 감자들은 감자의 껍질을 벗겨준 뒤 얇게 채를 썰어주세요.</p>
                    <p>2. 얇게 썬 감자는 흐르는 물에 두어 번 헹궈 전분기를 빼주세요. 전분기를 빼지 않으면 찰벼치대에서 찰벼를 만듭니다.</p>
                    <p>3. 헹군 감자는 물기를 꼭 짜준 뒤 부침가루 1.5 큰 술 소금 약간, 후추 약간을 넣고 버무려주세요.</p>
                </div>
            </div>
        </div>
    );
}

export default LecipeDetail;
