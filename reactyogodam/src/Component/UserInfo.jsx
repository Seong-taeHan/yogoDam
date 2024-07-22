import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/footer.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log(token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>User Info</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default UserInfo;