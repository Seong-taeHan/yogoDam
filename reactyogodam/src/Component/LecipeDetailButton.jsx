import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlusIconButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lecipeWrite');
  };

  return (
    <div className="plus-icon-button" onClick={handleClick}>
      <div className="plus-icon">누르면 작성 화면으로 넘어가유</div>
    </div>
  );
};

export default PlusIconButton;