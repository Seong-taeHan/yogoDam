import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Category.css';

const Category = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/lecipelist/${category}`);
  };

  return (
    <div className="container">
      <h1 className="title">카테고리</h1>
      <div className="section">
        <h2 className="subtitle">음식종류</h2>
        <div className="category">
          <div className="item" onClick={() => handleCategoryClick('한식')}>
            <div className="icon"></div>
            <p>한식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('양식')}>
            <div className="icon"></div>
            <p>양식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('중식')}>
            <div className="icon"></div>
            <p>중식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('일식')}>
            <div className="icon"></div>
            <p>일식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('기타')}>
            <div className="icon"></div>
            <p>기타</p>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="subtitle">음식재료</h2>
        <div className="category">
          <div className="item" onClick={() => handleCategoryClick('고기')}>
            <div className="icon"></div>
            <p>고기류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('생선')}>
            <div className="icon"></div>
            <p>생선류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('채소')}>
            <div className="icon"></div>
            <p>채소류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('가공')}>
            <div className="icon"></div>
            <p>가공식품</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('기타')}>
            <div className="icon"></div>
            <p>기타</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;