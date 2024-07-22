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
        <div className='Arrow'>←</div>
        <h1>내가 찜한 레시피</h1>
      </div>
      <div className="RecipeList">
        {itemList.map((item, index) => (
          <div className="RecipeItem" key={index}>
            <div className='cm'>
                <div className="RecipeDetails">
                <h3>{item.title}</h3>
            </div>
                {item.mark && <div className="Mark">🔖</div>}
                <img src={item.img} alt={item.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorite;
