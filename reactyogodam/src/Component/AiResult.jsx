import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/airesult.css';

const AiResult = () => {
  const location = useLocation();
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(location.state?.recipe || null);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (selectedRecipe) {
      handleRecipeClick(selectedRecipe['이름']);
    }
  }, [selectedRecipe]);

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

  return (
    <div>
      <div className="airesult-container">
        <div className="airesult-TopBar">추천 AI</div>
        <div className="airesult-Content">
          <div className="airesult-Text">비슷한 재료로 만들 수 있는<br />요리를 추천해 드릴게요!</div>
        </div>
        {selectedRecipe && (
          <div className="similar-recipes-container">
            <h3>{selectedRecipe.이름}와(과) 유사한 레시피:</h3>
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
