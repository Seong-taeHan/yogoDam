import React, { useState } from 'react';

const LecipeWrite = () => {
  const [ingredients, setIngredients] = useState([{ name: '', price: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', price: '' }]);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [event.target.name]: event.target.value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission here
    console.log('Form submitted:', { ingredients });
  };

  return (
    <div className='login_container'>
      <form onSubmit={handleSubmit}>
        <img className='bannerImg' src='../img/banner.png' alt='썸네일 이미지'></img>
        <h1>요리 제목 *필수</h1>
        <input type='text' placeholder='요리 제목 입력'></input>
        <div>요리 소개</div>
 
        <div>카테고리1 : 요리종류</div>
        <select name="category1">
          <option value="">--선택--</option>
          <option value="한식">한식</option>
          <option value="일식">일식</option>
          <option value="양식">양식</option>
          <option value="중식">중식</option>
          <option value="기타">기타</option>
        </select>

        <div>카테고리2 : 조리법</div>
        <select name="category2">
          <option value="">--선택--</option>
          <option value="분식">분식</option>
          <option value="탕-찜">탕-찜</option>
          <option value="볶음">볶음</option>
          <option value="구이">구이</option>
          <option value="무침">무침</option>
        </select>

        <div>재료</div>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="재료"
              value={ingredient.name}
              onChange={(event) => handleIngredientChange(index, event)}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>+</button>
        
        <div>요리순서</div>
        <div></div>
        <button type='submit'>저장하기</button>
      </form>
    </div>
  );
}

export default LecipeWrite;