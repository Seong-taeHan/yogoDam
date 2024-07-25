const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const conn = require('../config/database');

router.get('/lecipes', async (req, res) => {
    const db = req.app.locals.db;
  
    try {
      const result = await db.execute('SELECT FOOD_ID, FOOD_NAME, NOTIFICATION, NICK_NAME, FOOD_IMG FROM FOODS ORDER BY FOOD_ID DESC');
      //console.log(result.rows);

      const lecipes = await Promise.all(result.rows.map(async row => {
        let imageBase64 = null;
        if (row.FOOD_IMG) {
            const blob = await row.FOOD_IMG.getData();
            imageBase64 = blob.toString('base64');
        }
        return {
            FOOD_ID: row.FOOD_ID,
            FOOD_NAME: row.FOOD_NAME,
            NOTIFICATION: row.NOTIFICATION,
            NICK_NAME: row.NICK_NAME,
            FOOD_IMG: imageBase64,
        };

      }));



      //console.log(lecipes);
        
      res.status(200).json(lecipes);
      console.log("list -> DB 데이터 연결 확인");
    } catch (err) {
      console.error('레시피 목록 조회 오류:', err);
      res.status(500).send({ message: '서버 오류' });
    }
});

// 레시피 작성
router.post('/write', async (req, res) => {
  console.log('/write : ', req.body);
  const db = req.app.locals.db;

  try {
    const {
      user_id,
      nickName,
      title,  
      notification,
      cookTime,
      category1,
      category2,
      thumbnail, // Base64 인코딩된 이미지
      ingredients,
      steps = [] // 기본값으로 빈 배열을 설정
    } = req.body;

    const thumbnailData = thumbnail.replace(/^data:image\/\w+;base64,/, '');
    const thumbnailBuffer = Buffer.from(thumbnailData, 'base64');

    // 레시피 데이터를 데이터베이스에 저장하는 로직 작성
    const insertRecipeSql = `
      INSERT INTO FOODS (user_id, food_name, food_img, cook_time, upload_date, is_delete, food_price, cusine_type, cooking_method, nick_name, notification)
      VALUES (:user_id, :title, :thumbnail, :cookTime, SYSDATE, 'N', 0, :category1, :category2, :nickName, :notification)
      RETURNING food_id INTO :food_id
    `;
    const bindVars = {
      user_id,
      title,
      thumbnail: { val: thumbnailBuffer, type: oracledb.BLOB },
      cookTime,
      category1,
      category2,
      nickName,
      notification,
      food_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } // 반환값을 받을 변수
    };

    const result = await db.execute(insertRecipeSql, bindVars, { autoCommit: true });

    const foodId = result.outBinds.food_id[0];

    // 재료 데이터를 데이터베이스에 저장하는 로직
    const insertIngredientSql = `
      INSERT INTO INGREDIENTS (food_id, ingre_name, amount, ingred_unit)
      VALUES (:foodId, :name, :amount, :unit)
    `;
    for (const ingredient of ingredients) {
      await db.execute(insertIngredientSql, [foodId, ingredient.name, ingredient.amount, ingredient.unit], { autoCommit: true });
    }

    // 요리 순서 데이터를 데이터베이스에 저장하는 로직
    const insertStepSql = `
      INSERT INTO FOOD_STEPS (step_id, food_id, stepOrder, description, step_img)
      VALUES (SEQ_STEP_ID.NEXTVAL, :foodId, :stepOrder, :description, :step_img)
    `;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepImageBuffer = step.image ? Buffer.from(step.image, 'base64') : null;
      await db.execute(insertStepSql, [foodId, i + 1, step.description, { val: stepImageBuffer, type: oracledb.BLOB }], { autoCommit: true });
    }

    res.status(200).send({ message: '레시피가 성공적으로 저장되었습니다.' });
  } catch (err) {
    console.error('레시피 작성 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});

router.get('/favorites', async (req, res) => {
    const db = req.app.locals.db;
    const user_id = req.query.user_id; // 사용자의 ID를 쿼리로 받아옵니다.

    try {
        const result = await db.execute('SELECT FOOD_ID FROM USEFAVORITES WHERE USER_ID = :user_id', [user_id]);
        const favorites = result.rows.map(row => row.FOOD_ID);
        res.status(200).json(favorites);
    } catch (err) {
        console.error('즐겨찾기 목록 조회 오류:', err);
        res.status(500).send({ message: '서버 오류' });
    }
});

router.post('/favorites/toggle', async (req, res) => {
    const db = req.app.locals.db;
    const { user_id, food_id } = req.body;

    try {
        const result = await db.execute('SELECT * FROM USEFAVORITES WHERE USER_ID = :user_id AND FOOD_ID = :food_id', [user_id, food_id]);
        if (result.rows.length > 0) {
            // 이미 북마크가 존재하면 삭제
            await db.execute('DELETE FROM USEFAVORITES WHERE USER_ID = :user_id AND FOOD_ID = :food_id', [user_id, food_id], { autoCommit: true });
        } else {
            // 북마크가 존재하지 않으면 추가
            await db.execute("INSERT INTO USEFAVORITES (USER_ID, FOOD_ID, CREATED_AT, IS_FAVORITED) VALUES (:user_id, :food_id, SYSDATE, 'Y')", [user_id, food_id], { autoCommit: true });
        }
        res.status(200).send({ message: '즐겨찾기 상태가 변경되었습니다.' });
    } catch (err) {
        console.error('즐겨찾기 상태 변경 오류:', err);
        res.status(500).send({ message: '서버 오류' });
    }
});

router.get('/favorites/list', async (req, res) => {
    const db = req.app.locals.db;
    const { user_id } = req.query;

    try {
        const result = await db.execute(`
            SELECT f.FOOD_ID, f.FOOD_NAME, f.FOOD_IMG 
            FROM USEFAVORITES fav 
            JOIN FOODS f ON fav.FOOD_ID = f.FOOD_ID 
            WHERE fav.USER_ID = :user_id AND fav.IS_FAVORITED = 'Y'`, [user_id]
        );
        
        const favorites = await Promise.all(result.rows.map(async row => {
            let imageBase64 = null;
            if (row.FOOD_IMG) {
                const blob = await row.FOOD_IMG.getData();
                imageBase64 = blob.toString('base64');
            } return {
                FOOD_ID: row.FOOD_ID,
                FOOD_NAME: row.FOOD_NAME,
                FOOD_IMG: imageBase64
            }

        }));

        res.status(200).json(favorites);
    } catch (err) {
        console.error('즐겨찾기 목록 조회 오류:', err);
        res.status(500).send({ message: '서버 오류' });
    }
});

router.get('/favorites/bookmarkDel', async (req, res) => {
  const db = req.app.locals.db;
  const user_id = req.query.user_id; // 사용자의 ID를 쿼리로 받아옵니다.

  try {
      const result = await db.execute(`
        SELECT FOOD_ID FROM USEFAVORITES WHERE USER_ID = :user_id
        `,[user_id]);
      const favorites = result.rows.map(row => row.FOOD_ID);
      res.status(200).json(favorites);
  } catch (err) {
      console.error('북마크 해제 오류:', err);
      res.status(500).send({ message: '서버 오류' });
  }
});

module.exports = router;