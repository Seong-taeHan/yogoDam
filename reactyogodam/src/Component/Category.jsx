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
            <img className="icon" src='./img/icon/bibimbab.svg'/>
            <p>한식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('양식')}>
            <img className="icon" src='./img/icon/pizza.svg'/>
            <p>양식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('중식')}>
            <img className="icon" src='./img/icon/jjajangmyeon.svg'/>
            <p>중식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('일식')}>
            <img className="icon" src='./img/icon/chobab.svg'/>
            <p>일식</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('기타')}>
            <img className="icon" src='./img/icon/yp.svg'/>
            <p>기타</p>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="subtitle">음식재료</h2>
        <div className="category">
          <div className="item" onClick={() => handleCategoryClick('고기')}>
            <img className="icon" src='./img/icon/meat.svg'/>
            <p>고기류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('생선')}>
            <img className="icon" src='./img/icon/fish.svg'/>
            <p>생선류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('채소')}>
            <img className="icon" src='./img/icon/green.svg'/>
            <p>채소류</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('가공')}>
            <img className="icon" src='./img/icon/can.svg'/>
            <p>가공식품</p>
          </div>
          <div className="item" onClick={() => handleCategoryClick('기타')}>
            <img className="icon" src='./img/icon/gt.svg'/>
            <p>기타</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;