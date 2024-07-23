import React, { useState } from 'react';

const LecipeWrite = () => {
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [steps, setSteps] = useState([{ description: '', image: null, imagePreview: null }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
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

  const handleAddStep = () => {
    setSteps([...steps, { description: '', image: null, imagePreview: null }]);
  };

  const handleStepChange = (index, event) => {
    const newSteps = steps.map((step, i) => {
      if (i === index) {
        return { ...step, [event.target.name]: event.target.value };
      }
      return step;
    });
    setSteps(newSteps);
  };

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    const newSteps = steps.map((step, i) => {
      if (i === index) {
        return { ...step, image: file, imagePreview: URL.createObjectURL(file) };
      }
      return step;
    });
    setSteps(newSteps);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission here
    console.log('Form submitted:', { ingredients, steps });
  };

  return (
    <div className='login_container'>
      <form onSubmit={handleSubmit}>
        <img className='bannerImg' src='../img/banner.png' alt='썸네일 이미지'></img>
        <h1>레시피 제목 *필수</h1>
        <input type='text' placeholder='요리 제목 입력'></input>
        <div>요리 소개</div>
        <input type='text' placeholder='이 요리의 배경을 멋지게 소개해 주세요'></input>
        <div>요리 시간</div>
        <input type="text" placeholder="요리 시간 입력"></input>

        <div>요리종류</div>
        <select name="category1">
          <option value=""></option>
          <option value="한식">한식</option>
          <option value="일식">일식</option>
          <option value="양식">양식</option>
          <option value="중식">중식</option>
          <option value="기타">기타</option>
        </select>

        <div>요리재료</div>
        <select name="category2">
          <option value=""></option>
          <option value="고기">고기</option>
          <option value="생선">생선</option>
          <option value="채소">채소</option>
          <option value="가공">가공</option>
          <option value="기타">기타</option>
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
            <input
              type="text"
              name="amount"
              placeholder="양"
              value={ingredient.amount}
              onChange={(event) => handleIngredientChange(index, event)}
            />
            <input
              type="text"
              name="unit"
              placeholder="단위"
              value={ingredient.unit}
              onChange={(event) => handleIngredientChange(index, event)}
            />
            <button type="button" onClick={() => handleRemoveIngredient(index)}>- 재료 삭제</button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>+ 재료 추가</button>

        <div>요리순서</div>
        {steps.map((step, index) => (
          <div key={index}>
            {step.imagePreview ? (
              <img src={step.imagePreview} alt={`요리 순서 ${index + 1}`} style={{ width: '100px', height: '100px' }} />
            ) : (
              <div style={{ width: '300px', height: '300px', border: '1px solid gray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>이미지 없음</span>
              </div>
            )}
            <input
              type='text'
              name="description"
              placeholder="요리 순서 입력"
              value={step.description}
              onChange={(event) => handleStepChange(index, event)}
            />
            <input
              type='file'
              accept='image/*'
              onChange={(event) => handleImageChange(index, event)}
            />
            <button type="button" onClick={() => handleRemoveStep(index)}>- 순서 삭제</button>
          </div>
        ))}
        <button type="button" onClick={handleAddStep}>+ 요리순서 추가</button>

        <button type='submit'>작성하기</button>
      </form>
    </div>
  );
}

export default LecipeWrite;