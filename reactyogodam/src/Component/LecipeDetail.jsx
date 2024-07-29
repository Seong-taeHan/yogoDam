import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate로 변경
import axios from '../axios';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../css/LecipeDetail.css';

const LecipeDetail = () => {
    const { food_id } = useParams();
    const [recipeDetail, setRecipeDetail] = useState(null);
    const navigate = useNavigate(); // useNavigate 초기화

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

    const handleDelete = async () => {
        try {
            await axios.post('http://localhost:8000/list/lecipe/del', { foodId: food_id });
            alert('레시피가 삭제되었습니다.');
            navigate('/'); // 삭제 후 메인 페이지로 이동
        } catch (error) {
            console.error('레시피 삭제 중 오류가 발생했습니다:', error);
            alert('레시피 삭제 중 오류가 발생했습니다.');
        }
    };

    if (!recipeDetail) {
        console.log("RecipeDetail is null, food_id:", food_id);
        return <div>로딩 중...</div>; // 데이터가 아직 로드되지 않은 경우
    }

    return (
        <div className='lecipe-detail-container'>
            <div className='lecipe-detail-lp-container'>
                <div className='lecipe-detail-image-placeholder'>
                    {recipeDetail.recipe.image && 
                        <img src={`data:image/png;base64,${recipeDetail.recipe.image}`} alt={recipeDetail.recipe.name} />
                    }
                </div>
                <h1>{recipeDetail.recipe.name}</h1>
                <button>edit</button>
                <button onClick={handleDelete}>delete</button> {/* 삭제 버튼에 클릭 이벤트 핸들러 추가 */}
                <p>{recipeDetail.recipe.notification}</p>
                <div className='lecipe-detail-tags'>
                    <span className='lecipe-detail-tag'>{recipeDetail.recipe.cookTime}</span>
                </div>
                <table className='lecipe-detail-ingredient-table'>
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
                <div className='lecipe-detail-summary'>
                    <span>{recipeDetail.recipe.calories} kcal</span>
                    <span>합계 {recipeDetail.recipe.price} 원</span>
                </div>
                <h2>요리순서</h2>
                <hr></hr>
                <Swiper
                    modules={[Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className='lecipe-detail-instructions'
                >
                    {recipeDetail.steps.map((step, index) => (
                        <SwiperSlide key={index}>
                            <div className="lecipe-detail-instruction-slide">
                                {step.image && <img className='lecipe-detail-swiper-slide' src={`data:image/png;base64,${step.image}`} alt={`Step ${step.order}`} />}
                                <div className="lecipe-detail-instruction-text">
                                    <p className="lecipe-detail-description">{step.order}. {step.description}</p>
                                    <p className="lecipe-detail-step-counter">{step.order}/{recipeDetail.steps.length}</p>
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
