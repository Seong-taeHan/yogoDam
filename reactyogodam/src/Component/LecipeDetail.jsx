import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../css/LecipeDetail.css';

const LecipeDetail = () => {
    const { food_id } = useParams();
    const [recipeDetail, setRecipeDetail] = useState(null);

    useEffect(() => {
        // 백엔드에서 데이터 가져오기
        const fetchData = async () => {
            try {
                console.log("Fetching data for food_id:", food_id);
                const response = await axios.get('http://localhost:8000/list/recipes/detail', {
                    params: {
                        food_id
                    }
                });
                console.log("DB 데이터 응답 확인 : ", response.data);
                setRecipeDetail(response.data);
            } catch (error) {
                console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        };

        if (food_id) { // food_id가 존재하는지 확인
            fetchData();
        }
    }, [food_id]);

    if (!recipeDetail) {
        console.log("RecipeDetail is null, food_id:", food_id);
        return <div>로딩 중...</div>; // 데이터가 아직 로드되지 않은 경우
    }

    return (
        <div className='LecipeDetail_container'>
            <div className='lp_container'>
                <div className='image-placeholder'>
                    {recipeDetail.recipe.image && 
                        <img src={`data:image/png;base64,${recipeDetail.recipe.image}`} alt={recipeDetail.recipe.name} />
                    }
                </div>
                <h1>{recipeDetail.recipe.name}</h1>
                <p>{recipeDetail.recipe.notification}</p>
                <div className='tags'>
                    <span className='tag'>{recipeDetail.recipe.cookTime}</span>
                </div>
                <table className='ingredient_table'>
                    <tbody>
                        <tr>
                            <th>재료</th>
                            <th>계량</th>
                            <th>이번 달 평균가</th>
                        </tr>
                        {recipeDetail.ingredients.map((ingredient, index) => (
                            <tr key={index}>
                                <td>{ingredient.name}</td>
                                <td>{ingredient.amount} {ingredient.unit}</td>
                                <td>{ingredient.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='summary'>
                    <span>{recipeDetail.recipe.calories} kcal</span>
                    <span>합계 {recipeDetail.recipe.price} 원</span>
                </div>
                <h2>요리순서</h2>
                <hr></hr>
                <Swiper
                    modules={[Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className='instructions'
                >
                    {recipeDetail.steps.map((step, index) => (
                        <SwiperSlide key={index}>
                            <div className="instruction-slide">
                                {step.image && <img src={`data:image/png;base64,${step.image}`} alt={`Step ${step.order}`} />}
                                <div className="instruction-text">
                                    <p className="description">{step.order}. {step.description}</p>
                                    <p className="step-counter">{step.order}/{recipeDetail.steps.length}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default LecipeDetail;