import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
      navigate('/login');
    } else {
      setUserInfo({ nickName, user_id, user_email });
  
      const fetchUploadedRecipes = async () => {
        try {
          const response = await axios.get('http://localhost:8000/list/recipes/my', {
            params: { nick_name: nickName }
          });
          setUploadedRecipes(response.data);
        } catch (error) {
          console.error('내가 올린 레시피 데이터 오류가 발생했습니다:', error);
        }
      };
  
      const fetchSavedRecipes = async () => {
        try {
          const response = await axios.get('http://localhost:8000/list/favorites/list', {
            params: { user_id: user_id }
          });
          setSavedRecipes(response.data);
          console.log('찜한 레시피 데이터:', response.data);
        } catch (error) {
          console.error('찜한 레시피 데이터 오류가 발생했습니다:', error);
        }
      };
  
      fetchUploadedRecipes();
      fetchSavedRecipes();
    }
  }, [navigate]);

  const handleProductClick = (id) => {
    navigate(`/lecipeDetail/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickName');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="user-info-container">
      <header className="user-info-header">
        <img className='leftarrow' src="./img/icon/leftarrow.svg"/>
        <h1>MY</h1>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </header>
      <div className="user-profile">
        <img className="profile-picture" src='./img/testimg/groundimg.png'/>
        <div className="profile-details">
          <p className="nickname">{userInfo.nickName}</p>
          <p className="email">{userInfo.user_email}</p>
        </div>
      </div>
      <div className="buttons">
        <button className='btn1'>이용안내</button>
        <button className='btn2'>고객센터</button>
      </div>
      <div className="recipe-section">
        <div className="section-header">
          <p>내가 올린 레시피</p>
          <Link to={`/lecipeList?nick_name=${userInfo.nickName}`}>더 보기</Link>
        </div>
        <div className="recipe-list">
          {uploadedRecipes.map((recipe) => (
            <div key={recipe.FOOD_ID} className="recipe-item uploaded" onClick={() => handleProductClick(recipe.FOOD_ID)}>
              {recipe.FOOD_IMG ? (
                <img className="recipe-image" src={`data:image/png;base64,${recipe.FOOD_IMG}`} alt={recipe.FOOD_NAME} />
              ) : (
                <div className="recipe-image-placeholder"></div>
              )}
              <div className="recipe-info">
                <p className="recipe-title">{recipe.FOOD_NAME}</p>
                <p className="recipe-details">{recipe.NICK_NAME}</p>
                <p className="recipe-price">{recipe.NOTIFICATION}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="section-header">
          <p>내가 찜한 레시피</p>
          <Link to="/favorites">더 보기</Link>
        </div>
        <div className="recipe-list horizontal-scroll">
        {savedRecipes.map((recipe) => (
          <div key={recipe.FOOD_ID}  onClick={() => handleProductClick(recipe.FOOD_ID)} className="recipe-item saved">
            {recipe.FOOD_IMG ? (
              <img className="recipe-image" src={`data:image/png;base64,${recipe.FOOD_IMG}`} alt={recipe.FOOD_NAME}/>
            ) : (
              <div className="recipe-image-placeholder"></div>
            )}
            <p className="recipe-title">{recipe.FOOD_NAME}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default UserInfo;