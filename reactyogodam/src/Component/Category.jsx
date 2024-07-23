import React from 'react'
import '../css/Category.css';

const Category = () => {
  return (
    <div class="container">
        <h1 class="title">카테고리</h1>
        <div class="section">
            <h2 class="subtitle">음식종류</h2>
            <div class="category">
                <div class="item">
                    <div class="icon"></div>
                    <p>한식</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>양식</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>중식</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>일식</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>기타</p>
                </div>
            </div>
        </div>
        <div class="section">
            <h2 class="subtitle">음식재료</h2>
            <div class="category">
                <div class="item">
                    <div class="icon"></div>
                    <p>고기류</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>생선류</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>채소류</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>가공식품</p>
                </div>
                <div class="item">
                    <div class="icon"></div>
                    <p>기타</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Category