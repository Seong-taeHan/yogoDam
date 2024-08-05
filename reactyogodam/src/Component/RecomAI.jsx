import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/recomai.css';

const RecomAI = () => {
    const nav = useNavigate();

  return (
    <div className="recomai-container">
        <div className="ai-TopBar">추천 AI</div>
        <div className="ai-Content">
            <div className="ai-Text"></div>
            <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="ai-Image" />
        </div>
        <div>
            <button className="ai-Button" onClick={() => {nav('/aiselect')}}>음식 추천받기</button>
            <div className='ai-sbtitle-align'>
                <div className="ai-Subtitle">AI 레시피 추천받기란?</div>
            </div>
        </div>
    </div>
  );
};

export default RecomAI;