import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import '../css/Favorite.css';

function Favorite() {
    const [favorites, setFavorites] = useState([]);
    const [bookmarks, setBookmarks] = useState({});

    const nav = useNavigate();

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        
        axios.get('http://localhost:8000/list/favorites/list', {
            params: {
                user_id: user_id // 실제 사용자 ID를 사용
            }
        })
        .then(response => {
            const favoriteItems = response.data.map(item => ({
                id : item.FOOD_ID,
                title: item.FOOD_NAME,
                img: item.FOOD_IMG ? `data:image/jpg;base64,${item.FOOD_IMG}` : null,
                mark: true
            }));
            setFavorites(favoriteItems);
        })
        .catch(error => {
            console.error('즐겨찾기 데이터를 불러오는 중 오류 발생:', error);
        });
    }, []);

    const toggleBookmark = async (id) => {
        const user_id = localStorage.getItem('user_id');
        try {
            const response = await axios.post('http://localhost:8000/list/favorites/toggle', {
                user_id: user_id, // 실제 사용자 ID를 사용
                food_id: id
            });
            setBookmarks(prevBookmarks => ({
                ...prevBookmarks,
                [id]: !prevBookmarks[id]
            }));
        } catch (error) {
            console.error('즐겨찾기 상태 변경 오류:', error);
        }
    };

    return (
        <div className="FavoriteContainer">
            <div className='TopBar'>
                <img src='./img/icon/leftarrow.svg' className='Arrow' alt='Back'/>
                <h1>내가 찜한 레시피</h1>
            </div>
            <div className="RecipeList">
                {favorites.map((item, index) => (
                    <div className="RecipeItem" key={index}>
                        <div className='cm'>
                            <img src={item.img} alt={item.title} />
                            <div className="RecipeDetails">
                                <h3>{item.title}</h3>
                                {item.mark && 
                                <div className="Mark">
                                    <img 
                                    className='bookmark' 
                                    src={bookmarks[item.id] ?  "../img/icon/bookmark.svg":"../img/icon/bookmarked.svg"} 
                                    alt="bookmark" 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        toggleBookmark(item.id);
                                    }}
                                />
                                </div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorite;