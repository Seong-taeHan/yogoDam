import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PlusIconButton.css';

const PlusIconButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/lecipeWrite');
  };

  return (
    <div className="plus-icon-button" onClick={handleClick}>
      <div className="plus-icon">+</div>
    </div>
  );
};

export default PlusIconButton;