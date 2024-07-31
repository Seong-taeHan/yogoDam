import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/airesult.css';

const AiResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(location.state?.recipe || null);
  const [keyword, setKeyword] = useState('');
  const [selectRcp, setSelectRcp] = useState('');

  const testLecipes = [
    {food_id : 3000, name : '연어어묵김말이튀김'},
    {food_id : 119,  name : '야끼만두'},
    {food_id : 4000,  name : '어묵 잡채'},
    {food_id : 5000,  name : '고기 만두'},
  ]

  

  useEffect(() => {
    if (selectedRecipe) {
      handleRecipeClick(selectedRecipe['이름']);
      setSelectRcp(selectedRecipe['이름']);
    }
  }, []);

  const handleRecipeClick = (recipeName) => {
    fetch('http://localhost:5000/similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: recipeName, keyword }),
    })
      .then(response => response.json())
      .then(data => {
        setSelectedRecipe(data.selected_recipe);
        setSimilarRecipes(data.similar_recipes);

        console.log(`Selected Recipe: ${data.selected_recipe}`);
        console.log('Similar Recipes:', data.similar_recipes);
      })
      .catch(error => console.error('Error fetching similar recipes:', error));
  };

  const handleLecipeClick = (foodId) => {
    navigate(`/lecipeDetail/${foodId}`);
  };

  return (
    <div className="airesult-container">
      <div className="airesult-TopBar">추천 AI</div>
      <div className="airesult-Content">
        <div className="airesult-Text">비슷한 재료로 만들 수 있는<br />요리를 추천해 드릴게요!</div>
        {/* {selectedRecipe && (
          <div className="similar-recipes-container">
            {similarRecipes.map((recipe, index) => (
              <div key={index}><button className='airesult-button'>{recipe}</button></div>
            ))}
          </div>
        )} */}
        {/* 이 아래는 테스트 데이터 입니다 */}
        <div className="similar-recipes-container">
          {testLecipes.map((recipe, index) => (
            <div key={index}>
              <button 
                className='airesult-button' 
                onClick={() => handleLecipeClick(recipe.food_id)}
              >
                {recipe.name}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="airesult-footer">
        <div className='airesult-sbtitle-align'>
          <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="airesult-Image" />
        </div>
      </div>
    </div>
  );
};

export default AiResult;