import React from 'react';
import '../css/loginComplete.css';
import { useNavigate } from 'react-router-dom';

const LoginComplete = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-complete-container">
        <div className="emoji-container">
            <img src='/img/login/loginSmail.png' alt='로그인 표정' className="emoji-img" />
        </div>
        <div className="text-container">
            <h1>축하합니다!</h1>
            <h2><span>회원가입</span>이 완료됐습니다!</h2>
            <h2>환영합니다!!</h2>
        </div>
        <div className="button-container">
            <button className="home-button" onClick={handleHomeClick}>로그인 go!</button>
        </div>
    </div>
  );
}

export default LoginComplete;