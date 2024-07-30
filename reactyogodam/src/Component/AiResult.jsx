import React, { useState, useEffect } from 'react';
import '../css/airesult.css';

const AiResult = () => {
  const [recipeList, setRecipeList] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Flask 백엔드로부터 추천 레시피 데이터를 받아옵니다.
    fetch('http://localhost:5000/recommend')
      .then(response => response.json())
      .then(data => {
        console.log('선택한 메뉴에 대한 추천 메뉴:', data); // 추천 메뉴 확인
        setRecipeList(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleRecipeClick = (recipeName) => {
    fetch('http://localhost:5000/similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: recipeName, keyword: '특정키워드' }), // 키워드 추가
    })
      .then(response => response.json())
      .then(data => {
        setSelectedRecipe(data.selected_recipe);
        setSimilarRecipes(data.similar_recipes);

        // 콘솔 로그 추가
        console.log(`Selected Recipe: ${data.selected_recipe}`);
        console.log('Similar Recipes:', data.similar_recipes);
      })
      .catch(error => console.error('Error fetching similar recipes:', error));
  };

  return (
    <div>
      <div className="airesult-container">
        <div className="airesult-TopBar">추천 AI</div>
        <div className="airesult-Content">
          <div className="airesult-Text">비슷한 재료로 만들 수 있는<br />요리를 추천해 드릴게요!</div>
          <form>
            {recipeList.map((recipe, index) => (
              <div key={index} className="airesult-item">
                <input type='button' value={recipe['이름']} onClick={() => handleRecipeClick(recipe['이름'])}></input>
              </div>
            ))}
          </form>
        </div>
        {selectedRecipe && (
          <div className="similar-recipes-container">
            <h3>{selectedRecipe}와(과) 유사한 레시피:</h3>
            <ul>
              {similarRecipes.map((recipe, index) => (
                <li key={index}>{recipe}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <div className='aiselect-sbtitle-align'>
            <img src="/img/aicategory/aiconhalf.png" alt="AI 추천" className="aiselect-Image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiResult;
