import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axios';
import '../css/LecipeWrite.css';

const LecipeWrite = () => {
    const location = useLocation();
    const isEdit = location.state && location.state.recipeDetail;
    const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '', price: '' }]);
    const [steps, setSteps] = useState([{ description: '', image: null, imagePreview: null }]);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const fileInputRef = useRef(null);

    const token = localStorage.getItem('token');
    const nickName = localStorage.getItem('nickName');
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        if (isEdit) {
            const { recipe, ingredients, steps } = location.state.recipeDetail;
            setIngredients(ingredients);
            setSteps(steps.map(step => ({
                ...step,
                imagePreview: step.image ? `data:image/png;base64,${step.image}` : null
            })));
            setThumbnail(recipe.image);
            setThumbnailPreview(recipe.image ? `data:image/png;base64,${recipe.image}` : null);
        }
    }, [isEdit, location.state]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '', unit: '', price: '' }]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = async (index, e) => {
        const { name, value } = e.target;
        const newIngredients = ingredients.map((ingredient, i) => {
            if (i === index) {
                if (name === 'amount') {
                    const numericValue = value.replace(/[^0-9]/g, '');
                    return { ...ingredient, [name]: numericValue };
                }
                return { ...ingredient, [name]: value };
            }
            return ingredient;
        });

        setIngredients(newIngredients);

        if (name === 'name') {
            try {
                const response = await axios.get('/list/searchnutrition', {
                    params: { search: value }
                });

                if (response.data.length > 0) {
                    const { INGRED_N_PRICE } = response.data[0];
                    setIngredients(prevIngredients => {
                        const updatedIngredients = [...prevIngredients];
                        updatedIngredients[index].price = INGRED_N_PRICE;
                        return updatedIngredients;
                    });
                } else {
                    setIngredients(prevIngredients => {
                        const updatedIngredients = [...prevIngredients];
                        updatedIngredients[index].price = '알 수 없음';
                        return updatedIngredients;
                    });
                }
            } catch (error) {
                console.error('영양 정보 검색 오류:', error);
                setIngredients(prevIngredients => {
                    const updatedIngredients = [...prevIngredients];
                    updatedIngredients[index].price = '알 수 없음';
                    return updatedIngredients;
                });
            }
        }
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
                    return { ...step, image: reader.result, imagePreview: URL.createObjectURL(file) };
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
            setThumbnail(reader.result);
            setThumbnailPreview(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            food_id: location.state?.recipeDetail?.recipe?.food_id || '', // 수정 시 food_id 포함
            user_id,
            nickName,
            title: e.target[0].value,
            notification: e.target[1].value,
            cookTime: e.target[2].value,
            category1: e.target[3].value,
            category2: e.target[4].value,
            thumbnail,
            ingredients,
            steps
        };

        console.log('Submitting form data:', formData); // 로그 추가

        const url = isEdit ? '/list/edit' : '/list/write';

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Form submitted:', response.data);
            window.location.href = '/';
        } catch (error) {
            console.error('Form submission failed:', error);
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
                        style={{ display: 'none' }}
                    />
                </div>
                <p>레시피 제목</p>
                <input type='text' placeholder='요리 제목 입력' required defaultValue={location.state?.recipeDetail?.recipe?.name || ''}></input>
                <p>요리 소개</p>
                <input type='text' placeholder='이 요리의 배경을 멋지게 소개해 주세요' required defaultValue={location.state?.recipeDetail?.recipe?.notification || ''}></input>
                <p>요리 시간</p>
                <input type="text" placeholder="요리 시간 입력" required defaultValue={location.state?.recipeDetail?.recipe?.cookTime || ''}></input>

                <p>카테고리</p>
                <div className='select-container'>
                    <select name="category1" required defaultValue={location.state?.recipeDetail?.recipe?.category1 || ''}>
                        <option value=""></option>
                        <option value="한식">한식</option>
                        <option value="일식">일식</option>
                        <option value="양식">양식</option>
                        <option value="중식">중식</option>
                        <option value="기타">기타</option>
                    </select>

                    <select name="category2" required defaultValue={location.state?.recipeDetail?.recipe?.category2 || ''}>
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
                            <p>{ingredient.price ? `가격: ${ingredient.price}` : '가격 정보 없음'}</p>
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
                                style={{ display: 'none' }}
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

                <button type='submit'>{isEdit ? '수정하기' : '작성하기'}</button>
            </form>
        </div>
    );
}

export default LecipeWrite;
