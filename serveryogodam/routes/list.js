const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const conn = require('../config/database');

router.get('/lecipes', async (req, res) => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  try {
      const result = await db.execute(`
          SELECT * FROM (
              SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, COUNT(u.FOOD_ID) AS POPULARITY, 
                     ROW_NUMBER() OVER (ORDER BY f.FOOD_ID DESC) AS rn
              FROM FOODS f
              LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
              GROUP BY f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME
          ) WHERE rn > :offset AND rn <= :offset + :itemsPerPage
      `, { offset, itemsPerPage });

      const lecipes = await Promise.all(result.rows.map(async row => {
          const foodImgResult = await db.execute('SELECT FOOD_IMG FROM FOODS WHERE FOOD_ID = :foodId', [row.FOOD_ID]);
          let imageBase64 = null;
          if (foodImgResult.rows[0].FOOD_IMG) {
              const blob = await foodImgResult.rows[0].FOOD_IMG.getData();
              imageBase64 = blob.toString('base64');
          }
          return {
              FOOD_ID: row.FOOD_ID,
              FOOD_NAME: row.FOOD_NAME,
              NOTIFICATION: row.NOTIFICATION,
              NICK_NAME: row.NICK_NAME,
              FOOD_IMG: imageBase64,
              POPULARITY: row.POPULARITY
          };
      }));

      res.status(200).json(lecipes);
      console.log("list -> DB 데이터 연결 확인");
  } catch (err) {
      console.error('레시피 목록 조회 오류:', err);
      res.status(500).send({ message: '서버 오류' });
  }
});

router.get('/lecipes/pop', async (req, res) => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  try {
      const result = await db.execute(`
          SELECT * FROM (
              SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, COUNT(u.FOOD_ID) AS POPULARITY,
                     ROW_NUMBER() OVER (ORDER BY COUNT(u.FOOD_ID) DESC) AS rn
              FROM FOODS f
              LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
              GROUP BY f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME
          ) WHERE rn > :offset AND rn <= :offset + :itemsPerPage
      `, { offset, itemsPerPage });

      const lecipes = await Promise.all(result.rows.map(async row => {
          const foodImgResult = await db.execute('SELECT FOOD_IMG FROM FOODS WHERE FOOD_ID = :foodId', [row.FOOD_ID]);
          let imageBase64 = null;
          if (foodImgResult.rows[0].FOOD_IMG) {
              const blob = await foodImgResult.rows[0].FOOD_IMG.getData();
              imageBase64 = blob.toString('base64');
          }
          return {
              FOOD_ID: row.FOOD_ID,
              FOOD_NAME: row.FOOD_NAME,
              NOTIFICATION: row.NOTIFICATION,
              NICK_NAME: row.NICK_NAME,
              FOOD_IMG: imageBase64,
              POPULARITY: row.POPULARITY
          };
      }));

      res.status(200).json(lecipes);
      console.log("pop -> DB 데이터 연결 확인");
  } catch (err) {
      console.error('인기순 레시피 목록 조회 오류:', err);
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
      console.log(step.STEP_IMG);
      const stepImgData = step.image.replace(/^data:image\/\w+;base64,/, '');
      const stepImageBuffer = Buffer.from(stepImgData, 'base64');
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
    const user_id = req.query.user_id;// 사용자의 ID를 쿼리로 받아옵니다.

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

// 레시피 상세 조회
router.get('/recipes/detail', async (req, res) => {
  const db = req.app.locals.db;
  const food_id = req.query.food_id;

  try {
    const result = await db.execute(
      `SELECT INGRE_NAME, AMOUNT, INGRED_UNIT, INGRED_PRICE
      FROM INGREDIENTS
      WHERE FOOD_ID = :food_id`, [food_id]);
    
    const ingredients = result.rows.map(row => ({
      name: row.INGRE_NAME,
      amount: row.AMOUNT,
      unit: row.INGRED_UNIT,
      price: row.INGRED_PRICE
    }));
    const stepsResult = await db.execute(
      `SELECT STEPORDER, DESCRIPTION, STEP_IMG
      FROM FOOD_STEPS
      WHERE FOOD_ID = :food_id
      ORDER BY STEPORDER`, [food_id]);

    const steps = await Promise.all(stepsResult.rows.map(async row => { 
      let stepImageBase64 = null;
      if (row.STEP_IMG) {
        const blob = await row.STEP_IMG.getData();
        stepImageBase64 = blob.toString('base64');
      }
      return {
        order: row.STEPORDER,
        description: row.DESCRIPTION,
        image: stepImageBase64
      };
    }));

    const recipeResult = await db.execute(
      `SELECT FOOD_NAME, FOOD_IMG, COOK_TIME, IS_DELETE, FOOD_PRICE, NOTIFICATION
      FROM FOODS
      WHERE FOOD_ID = :food_id`, [food_id]);

    const recipe = await recipeResult.rows.map(async row => {
      let imageBase64 = null;
      if (row.FOOD_IMG) {
      const blob = await row.FOOD_IMG.getData();
      imageBase64 = blob.toString('base64');
      }
      return {
      name: row.FOOD_NAME,
      image: imageBase64,
      cookTime: row.COOK_TIME,
      isDelete: row.IS_DELETE,
      price: row.FOOD_PRICE,
      notification: row.NOTIFICATION
      };
    })[0];

    res.status(200).json({ ingredients, steps, recipe });

  } catch (err) {
    console.error('레시피 상세 조회 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});


router.get('/recipes/my', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const result = await db.execute(`
      SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, COUNT(u.FOOD_ID) AS POPULARITY
      FROM FOODS f
      LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
      WHERE f.NICK_NAME = :nick_name
      GROUP BY f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME
      ORDER BY f.FOOD_ID DESC
    `, { nick_name: req.query.nick_name });

    const recipes = await Promise.all(result.rows.map(async row => {
      const foodImgResult = await db.execute('SELECT FOOD_IMG FROM FOODS WHERE FOOD_ID = :foodId', [row.FOOD_ID]);
      let imageBase64 = null;
      if (foodImgResult.rows[0] && foodImgResult.rows[0].FOOD_IMG) {
        const blob = await foodImgResult.rows[0].FOOD_IMG.getData();
        imageBase64 = blob.toString('base64');
      }
      return {
        FOOD_ID: row.FOOD_ID,
        FOOD_NAME: row.FOOD_NAME,
        NOTIFICATION: row.NOTIFICATION,
        NICK_NAME: row.NICK_NAME,
        FOOD_IMG: imageBase64,
        POPULARITY: row.POPULARITY
      };
    }));

    res.status(200).json(recipes);
  } catch (err) {
    console.error('레시피 목록 조회 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});


router.get('/categorylist', async (req, res) => {
  const db = req.app.locals.db;
  const { category } = req.query;

  try {
    const result = await db.execute(`
      SELECT FOOD_ID, FOOD_NAME, NOTIFICATION, NICK_NAME, FOOD_IMG, FOOD_PRICE
      FROM FOODS 
      WHERE CUSINE_TYPE = :category OR COOKING_METHOD = :category
      ORDER BY FOOD_ID DESC 
    `, { category });

    const recipes = await Promise.all(result.rows.map(async row => {
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
        FOOD_PRICE: row.FOOD_PRICE
      };
    }));

    res.status(200).json(recipes);
  } catch (err) {
    console.error('레시피 목록 조회 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});


router.get('/searchlist', async (req, res) => {
  const db = req.app.locals.db;
  const { search } = req.query;

  console.log('검색어:', search);

  try {
    if (!db) {
      throw new Error('데이터베이스에 연결할 수 없습니다.');
    }

    const result = await db.execute(`
        SELECT *
        FROM FOODS
        WHERE FOOD_NAME = :search
        OR FOOD_ID IN (
            SELECT FOOD_ID
            FROM INGREDIENTS
            WHERE INGRE_NAME = :search
        )
    `, { search });

    console.log('쿼리 결과:', result.rows);

    const recipes = await Promise.all(result.rows.map(async row => {
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
        FOOD_PRICE: row.FOOD_PRICE
      };
    }));

    res.status(200).json(recipes);
  } catch (err) {
    console.error('레시피 목록 조회 오류:', err);
    res.status(500).send({ message: '서버 오류', error: err.message });
  }
});

router.get('/searchnutrition', async (req, res) => {
  const db = req.app.locals.db;
  const { search } = req.query;
  console.log(req.query);

  console.log('검색어:', search);

  try {
    if (!db) {
      throw new Error('데이터베이스에 연결할 수 없습니다.');
    }

    const query = `
      SELECT NUTRI_ID, PROTEIN, CARBOHYDRATE, FAT, 
             (PROTEIN * 4 + CARBOHYDRATE * 4 + FAT * 9) AS TOTALCAL, 
             INGRED_N_PRICE
      FROM NUTRITION
      WHERE NUTRI_ID = :search
    `;

    const result = await db.execute(query, { search });

    console.log('쿼리 결과:', result.rows);

    const recipes = result.rows.map(row => ({
      NUTRI_ID: row.NUTRI_ID,
      PROTEIN: row.PROTEIN,
      CARBOHYDRATE: row.CARBOHYDRATE,
      FAT: row.FAT,
      TOTALCAL: row.TOTALCAL,
      INGRED_N_PRICE: row.INGRED_N_PRICE
    }));

    res.status(200).json(recipes);
  } catch (err) {
    console.error('nutrition 오류:', err);
    res.status(500).send({ message: '서버 오류', error: err.message });
  }
});


module.exports = router;
