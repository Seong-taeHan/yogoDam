import React from 'react'
import '../css/airesult.css'

const AiResult = () => {

  const recipeList = [
    { name : 김치찌개 },
    { name : 참치볶음 },
    { name : 햄버거 }
  ]

  return (
    <div>
      <div className="airesult-container">
        <div className="airesult-TopBar">추천 AI</div>
        <div className="airesult-Content">
            <div className="airesult-Text">비슷한 재료로 만들 수 있는<br></br>요리를 추천해 드릴게요!</div>
            <form>
              <input ></input>
            </form>
        </div>
        <div>
            <div className='aiselect-sbtitle-align'>
                <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="aiselect-Image" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default AiResult