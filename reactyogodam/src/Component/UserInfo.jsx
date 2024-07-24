import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/userInfo.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({ nickName: '', user_id: '', user_email: '' });
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nickName = localStorage.getItem('nickName');
    const user_id = localStorage.getItem('user_id');
    const user_email = localStorage.getItem('userEmail');

    if (!token) {
      // navigate('/login');
    } else {
      setUserInfo({ nickName, user_id, user_email });

      // Example data, replace with actual data fetching logic
      setUploadedRecipes([
        { id: 1, title: '돼지고기 불고기! 고기는 언제나 옳다! 손쉽게 즐길 수 있는 고기요리', price: '10,000 원' },
      ]);

      setSavedRecipes([
        { id: 1, title: '돼지고기 불고기! 고기는 언제나 옳다! 손쉽게 즐길 수 있는 고기요리' },
        { id: 2, title: '돼지고기 불고기! 고기는 언제나 옳다! 손쉽게 즐길 수 있는 고기요리' },
      ]);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickName');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <>
      <div className="user-info-container">
        <header className="user-info-header">
          <img className='leftarrow' src="./img/icon/leftarrow.svg"/>
          <h1>MY</h1>
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </header>
        <div className="user-profile">
          <img className="profile-picture" src='./img/testimg/groundimg.png'/>
          <div className="profile-details">
            <p className="nickname">{userInfo.nickName}최강3팀</p>
            <p className="email">{userInfo.user_email}0000000000@0000</p>
          </div>
        </div>
        <div className="buttons">
          <button className='btn1'>이용안내</button>
          <button className='btn2'>고객센터</button>
        </div>
        <div className="recipe-section">
          <div className="section-header">
            <p>내가 올린 레시피</p>
            <button>더 보기</button>
          </div>
          <div className="recipe-list">
            {uploadedRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-item uploaded">
                <div className="recipe-image-placeholder"></div>
                <div className="recipe-info">
                  <p className="recipe-title">{recipe.title}</p>
                  <p className="recipe-details">요고담 레시피</p>
                  <p className="recipe-price">{recipe.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="section-header">
            <p>내가 찜한 레시피</p>
            <button>더 보기</button>
          </div>
          <div className="recipe-list horizontal-scroll">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-item saved">
                <div className="recipe-image-placeholder"></div>
                <p className="recipe-title">{recipe.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserInfo;
