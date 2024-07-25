import axios from '../axios';
import React, { useState, useRef } from 'react';
import '../css/LecipeWrite.css'

const LecipeWrite = () => {
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [steps, setSteps] = useState([{ description: '', image: null, imagePreview: null }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');
  const nickName = localStorage.getItem('nickName');
  const user_id = localStorage.getItem('user_id');

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [e.target.name]: e.target.value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, { description: '', image: null, imagePreview: null }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, e) => {
    const newSteps = steps.map((step, i) => {
      if (i === index) {
        return { ...step, [e.target.name]: e.target.value };
      }
      return step;
    });
    setSteps(newSteps);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const newSteps = steps.map((step, i) => {
        if (i === index) {
          return { ...step, image: reader.result, imagePreview: URL.createObjectURL(file) }; // Base64 인코딩된 이미지 저장
        }
        return step;
      });
      setSteps(newSteps);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result); // Base64 인코딩된 이미지 저장
      setThumbnailPreview(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      user_id,
      nickName,
      title: e.target[1].value,
      notification: e.target[2].value,
      cookTime: e.target[3].value,
      category1: e.target[4].value,
      category2: e.target[5].value,
      thumbnail,
      ingredients,
      steps
    };

    try {
      const response = await axios.post('/list/write', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Form submitted:', response.data);
      // Handle success (e.g., navigate to another page or show success message)
    } catch (error) {
      console.error('Form submission failed:', error);
      // Handle error (e.g., show error message)
    }
  };

  const handleThumbnailClick = () => {
    fileInputRef.current.click();
  };

  const handleStepImageClick = (index) => {
    document.getElementById(`step-image-input-${index}`).click();
  };

  return (
    <div className='write-container'>
      <form onSubmit={handleSubmit} className='write-form'>
        <div onClick={handleThumbnailClick}>
          {thumbnailPreview ? (
            <img className='write-thumbnail' src={thumbnailPreview} alt='썸네일 이미지' />
          ) : (
            <div className='thumbnail-placeholder'>
              <img className='write-thumbnail' src='/img/recipeDetailImg/firstImg.png' alt='초기 상태'></img>
            </div>
          )}
          <input 
            className='thumbnail-input' 
            type='file' 
            accept='image/*' 
            onChange={handleThumbnailChange}
            ref={fileInputRef}
          />
        </div>
        <p>레시피 제목</p>
        <input type='text' placeholder='요리 제목 입력' required></input>
        <p>요리 소개</p>
        <input type='text' placeholder='이 요리의 배경을 멋지게 소개해 주세요' required></input>
        <p>요리 시간</p>
        <input type="text" placeholder="요리 시간 입력" required></input>

        <p>카테고리</p>
        <div className='select-container'>
          <select name="category1" required>
            <option value=""></option>
            <option value="한식">한식</option>
            <option value="일식">일식</option>
            <option value="양식">양식</option>
            <option value="중식">중식</option>
            <option value="기타">기타</option>
          </select>

          <select name="category2" required>
            <option value=""></option>
            <option value="고기">고기</option>
            <option value="생선">생선</option>
            <option value="채소">채소</option>
            <option value="가공">가공</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <p>재료</p>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <div className='write-ingredient-row'>
            <input
              type="text"
              name="name"
              placeholder="재료"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, e)}
              required
            />
            <input
              type="text"
              name="amount"
              placeholder="양"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, e)}
              required
            />
            <input
              type="text"
              name="unit"
              placeholder="단위"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, e)}
              required
            />
            </div>
            <button type="button" onClick={() => handleRemoveIngredient(index)}>- 재료 삭제</button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>+ 재료 추가</button>

        <p>요리순서</p>
        {steps.map((step, index) => (
          <div key={index}>
            <div className='step-image-placeholder' onClick={() => handleStepImageClick(index)}>
              {step.imagePreview ? (
                <img src={step.imagePreview} alt={`요리 순서 ${index + 1}`} className='write-thumbnail' />
              ) : (
                <img className='write-thumbnail' src='/img/recipeDetailImg/firstImg.png' alt='초기 상태'></img>
              )}
              <input
                id={`step-image-input-${index}`}
                className='step-input'
                type='file'
                accept='image/*'
                onChange={(e) => handleImageChange(index, e)}
              />
            </div>
            <input
              type='text'
              name="description"
              placeholder="요리 순서 입력"
              value={step.description}
              onChange={(e) => handleStepChange(index, e)}
              required
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