import React from 'react';
import '../css/Favorite.css';

function Favorite() {
    const itemList = [
        { title: "돼지불고기1", mark: true, img: "/img/testImg/totoro1.png" },
        { title: "돼지불고기2", mark: true, img: "/img/testImg/totoro1.png" },
        { title: "돼지불고기3", mark: true, img: "/img/testImg/totoro1.png" },
        { title: "돼지불고기4", mark: true, img: "/img/testImg/totoro1.png" },
    ];

    return (
        <div className="FavoriteContainer">
            <div className='TopBar'>
                <img src='./img/icon/leftarrow.svg' className='Arrow'/>
                <h1>내가 찜한 레시피</h1>
            </div>
            <div className="RecipeList">
                {itemList.map((item, index) => (
                    <div className="RecipeItem" key={index}>
                        <div className='cm'>
                            <img src={item.img} alt={item.title} />
                            <div className="RecipeDetails">
                                <h3>{item.title}</h3>
                                {item.mark && <div className="Mark"><img className="bookmark" src="./img/icon/bookmark.svg" /></div>}
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorite;
