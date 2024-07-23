import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/footer.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({ nickName: '', user_id: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nickName = localStorage.getItem('nickName');
    const user_id = localStorage.getItem('user_id');
    const user_email = localStorage.getItem('userEmail');

    console.log('Token:', token);
    console.log('NickName:', nickName);
    console.log('UserID:', user_id);
    console.log('UserEmail:', user_email);

    if (!token) {
      navigate('/login');
    } else {
      setUserInfo({ nickName, user_id, user_email });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickName');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div>
      <h1>MY</h1>
      <p>닉네임: {userInfo.nickName}</p>
      <p>사용자 이메일 : {userInfo.user_email}</p>
      <button>이용안내</button>
      <button>고객센터</button>
      <button onClick={handleLogout}>로그아웃</button>
      <p>내가 찜한 레시피<button>더보기</button></p>
      <div>찜 기능 추가(가로 이동)</div>
      <p>내가 올린 레시피<button>더보기</button></p>
      <div>작성 레시피 ㄱㄱ</div>
    </div>
  );
}

export default UserInfo;