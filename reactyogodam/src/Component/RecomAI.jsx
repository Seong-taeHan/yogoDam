import React from 'react';
import '../css/recomai.css';

const RecomAI = () => {
  return (
    <div className="recomai-container">
        <div className="ai-TopBar">추천 AI</div>
        <div className="ai-Content">
            <div className="ai-Text">무엇을 요리할지<br></br>고민이 된다면!</div>
            <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="ai-Image" />
        </div>
        <div>
            <button className="ai-Button">음식 추천받기</button>
            <div className='ai-sbtitle-align'>
                <div className="ai-Subtitle">AI 레시피 추천받기란?</div>
            </div>
        </div>
    </div>
  );
};

export default RecomAI;