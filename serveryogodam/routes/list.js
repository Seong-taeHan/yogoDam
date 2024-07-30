const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const conn = require('../config/database');

router.use(bodyParser.json()); // body-parser 미들웨어 사용

// 레시피 목록 조회
router.get('/lecipes', async (req, res) => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  try {
    const result = await db.execute(`
      SELECT * FROM (
        SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, f.FOOD_PRICE, COUNT(u.FOOD_ID) AS POPULARITY, 
               ROW_NUMBER() OVER (ORDER BY f.FOOD_ID DESC) AS rn
        FROM FOODS f
        LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
        WHERE f.IS_DELETE = 'N'
        GROUP BY f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, f.FOOD_PRICE
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
        FOOD_PRICE: row.FOOD_PRICE,
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

// 인기순 레시피 목록 조회
router.get('/lecipes/pop', async (req, res) => {
  const db = req.app.locals.db;
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  try {
    const result = await db.execute(`
      SELECT * FROM (
        SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, f.FOOD_PRICE, COUNT(u.FOOD_ID) AS POPULARITY,
               ROW_NUMBER() OVER (ORDER BY COUNT(u.FOOD_ID) DESC) AS rn
        FROM FOODS f
        LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
        WHERE f.IS_DELETE = 'N'
        GROUP BY f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, f.FOOD_PRICE
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
        FOOD_PRICE: row.FOOD_PRICE,
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

    // thumbnail이 유효한지 확인
    let thumbnailBuffer = null;
    if (thumbnail) {
      const thumbnailData = thumbnail.replace(/^data:image\/\w+;base64,/, '');
      thumbnailBuffer = Buffer.from(thumbnailData, 'base64');
    }

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

    const insertIngredientSql = `
      INSERT INTO INGREDIENTS (food_id, ingre_name, amount, ingred_unit)
      VALUES (:foodId, :name, :amount, :unit)
    `;
    for (const ingredient of ingredients) {
      await db.execute(insertIngredientSql, [foodId, ingredient.name, ingredient.amount, ingredient.unit], { autoCommit: true });
    }

    const insertStepSql = `
      INSERT INTO FOOD_STEPS (step_id, food_id, stepOrder, description, step_img)
      VALUES (SEQ_STEP_ID.NEXTVAL, :foodId, :stepOrder, :description, :step_img)
    `;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // step.image가 유효한지 확인
      let stepImageBuffer = null;
      if (step.image) {
        const stepImgData = step.image.replace(/^data:image\/\w+;base64,/, '');
        stepImageBuffer = Buffer.from(stepImgData, 'base64');
      }

      await db.execute(insertStepSql, [foodId, i + 1, step.description, { val: stepImageBuffer, type: oracledb.BLOB }], { autoCommit: true });
    }

    res.status(200).send({ message: '레시피가 성공적으로 저장되었습니다.' });
  } catch (err) {
    console.error('레시피 작성 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});


// 레시피 수정
router.post('/edit', async (req, res) => {
  const db = req.app.locals.db;
  try {
    const {
      food_id,
      user_id,
      nickName,
      title,
      notification,
      cookTime,
      category1,
      category2,
      thumbnail, // Base64 인코딩된 이미지
      ingredients,
      steps
    } = req.body;

    // food_id가 숫자인지 확인
    if (isNaN(food_id)) {
      throw new Error('Invalid food_id: must be a number');
    }

    // thumbnail이 유효한지 확인
    let thumbnailBuffer = null;
    if (thumbnail) {
      const thumbnailData = thumbnail.replace(/^data:image\/\w+;base64,/, '');
      thumbnailBuffer = Buffer.from(thumbnailData, 'base64');
    }

    // 레시피 업데이트
    const updateRecipeQuery = `
      UPDATE FOODS
      SET
        user_id = :user_id,
        nick_Name = :nickName,
        food_name = :title,
        notification = :notification,
        cook_time = :cookTime,
        cusine_type = :category1,
        cooking_method = :category2,
        food_img = :thumbnail
      WHERE food_id = :food_id
    `;
    const updateRecipeBindVars = {
      user_id,
      nickName,
      title,
      notification,
      cookTime,
      category1,
      category2,
      thumbnail: { val: thumbnailBuffer, type: oracledb.BLOB },
      food_id: Number(food_id) // 숫자로 변환
    };
    await db.execute(updateRecipeQuery, updateRecipeBindVars, { autoCommit: true });

    // 기존 재료 삭제
    const deleteIngredientsQuery = `
      DELETE FROM INGREDIENTS WHERE food_id = :food_id
    `;
    await db.execute(deleteIngredientsQuery, { food_id: Number(food_id) }, { autoCommit: true });

    // 새로운 재료 삽입
    const insertIngredientQuery = `
      INSERT INTO INGREDIENTS (food_id, ingre_name, amount, ingred_unit, ingred_price)
      VALUES (:food_id, :name, :amount, :unit, :price)
    `;
    for (const ingredient of ingredients) {
      const amount = isNaN(Number(ingredient.amount)) ? 0 : Number(ingredient.amount);
      const price = isNaN(Number(ingredient.price)) ? 0 : Number(ingredient.price);
      const insertIngredientBindVars = {
        food_id: Number(food_id), // 숫자로 변환
        name: ingredient.name,
        amount,
        unit: ingredient.unit,
        price
      };
      await db.execute(insertIngredientQuery, insertIngredientBindVars, { autoCommit: true });
    }

    // 기존 요리 순서 삭제
    const deleteStepsQuery = `
      DELETE FROM FOOD_STEPS WHERE food_id = :food_id
    `;
    await db.execute(deleteStepsQuery, { food_id: Number(food_id) }, { autoCommit: true });

    // 새로운 요리 순서 삽입
    const insertStepQuery = `
      INSERT INTO FOOD_STEPS (step_id, food_id, stepOrder, description, step_img)
      VALUES (SEQ_STEP_ID.NEXTVAL, :food_id, :stepOrder, :description, :image)
    `;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      let stepImageBuffer = null;
      if (step.image) {
        const stepImgData = step.image.replace(/^data:image\/\w+;base64,/, '');
        stepImageBuffer = Buffer.from(stepImgData, 'base64');
      }
      const insertStepBindVars = {
        food_id: Number(food_id), // 숫자로 변환
        stepOrder: i + 1,
        description: step.description,
        image: { val: stepImageBuffer, type: oracledb.BLOB }
      };
      await db.execute(insertStepQuery, insertStepBindVars, { autoCommit: true });
    }

    res.status(200).json({ message: '레시피가 성공적으로 수정되었습니다.' });
  } catch (err) {
    console.error('500err', err);
    console.error('수정 오류');
    res.status(500).json({ message: '레시피 수정 중 오류가 발생했습니다.', error: err.message });
  }
});


// 즐겨찾기 목록 조회
router.get('/favorites', async (req, res) => {
  const db = req.app.locals.db;
  const user_id = req.query.user_id; // 사용자의 ID를 쿼리로 받아옵니다.

  try {
    const result = await db.execute(`
      SELECT uf.FOOD_ID 
      FROM USEFAVORITES uf
      JOIN FOODS f ON uf.FOOD_ID = f.FOOD_ID
      WHERE uf.USER_ID = :user_id
      AND f.IS_DELETE = 'N'
    `, [user_id]);
    const favorites = result.rows.map(row => row.FOOD_ID);
    res.status(200).json(favorites);
  } catch (err) {
    console.error('즐겨찾기 목록 조회 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});

// 즐겨찾기 토글
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

// 즐겨찾기 목록 조회 (상세)
router.get('/favorites/list', async (req, res) => {
  const db = req.app.locals.db;
  const { user_id } = req.query;

  try {
    const result = await db.execute(`
      SELECT f.FOOD_ID, f.FOOD_NAME, f.FOOD_IMG 
      FROM USEFAVORITES fav 
      JOIN FOODS f ON fav.FOOD_ID = f.FOOD_ID 
      WHERE fav.USER_ID = :user_id 
        AND fav.IS_FAVORITED = 'Y' 
        AND f.IS_DELETE = 'N'
    `, [user_id]);

    const favorites = await Promise.all(result.rows.map(async row => {
      let imageBase64 = null;
      if (row.FOOD_IMG) {
        const blob = await row.FOOD_IMG.getData();
        imageBase64 = blob.toString('base64');
      }
      return {
        FOOD_ID: row.FOOD_ID,
        FOOD_NAME: row.FOOD_NAME,
        FOOD_IMG: imageBase64
      };
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
    const result = await db.execute(`
      SELECT INGRE_NAME, AMOUNT, INGRED_UNIT, INGRED_PRICE
      FROM INGREDIENTS
      WHERE FOOD_ID = :food_id
    `, [food_id]);

    const ingredients = result.rows.map(row => ({
      name: row.INGRE_NAME,
      amount: row.AMOUNT,
      unit: row.INGRED_UNIT,
      price: row.INGRED_PRICE
    }));

    const stepsResult = await db.execute(`
      SELECT STEPORDER, DESCRIPTION, STEP_IMG
      FROM FOOD_STEPS
      WHERE FOOD_ID = :food_id
      ORDER BY STEPORDER
    `, [food_id]);

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

    const recipeResult = await db.execute(`
      SELECT FOOD_NAME, FOOD_IMG, COOK_TIME, IS_DELETE, FOOD_PRICE, NOTIFICATION, USER_ID
      FROM FOODS
      WHERE FOOD_ID = :food_id
    `, [food_id]);

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
        notification: row.NOTIFICATION,
        userId : row.USER_ID
      };
    })[0];

    res.status(200).json({ ingredients, steps, recipe });

  } catch (err) {
    console.error('레시피 상세 조회 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});

// 사용자 레시피 목록 조회
router.get('/recipes/my', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const result = await db.execute(`
      SELECT f.FOOD_ID, f.FOOD_NAME, f.NOTIFICATION, f.NICK_NAME, COUNT(u.FOOD_ID) AS POPULARITY
      FROM FOODS f
      LEFT JOIN USEFAVORITES u ON f.FOOD_ID = u.FOOD_ID AND u.IS_FAVORITED = 'Y'
      WHERE f.NICK_NAME = :nick_name AND f.IS_DELETE = 'N'
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

// 카테고리별 레시피 목록 조회
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

// 검색어를 통한 레시피 목록 조회
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
      WHERE (FOOD_NAME = :search OR FOOD_ID IN (
          SELECT FOOD_ID
          FROM INGREDIENTS
          WHERE INGRE_NAME = :search
      )) AND IS_DELETE = 'N'
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

// 영양 정보를 통한 레시피 목록 조회
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
             INGRED_N_PRICE, NUTRI_UNIT
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
      INGRED_N_PRICE: row.INGRED_N_PRICE,
      INGRED_UNIT : row.NUTRI_UNIT
    }));

    console.log(recipes);

    res.status(200).json(recipes);
  } catch (err) {
    console.error('nutrition 오류:', err);
    res.status(500).send({ message: '서버 오류', error: err.message });
  }
});

// 레시피 삭제 상태 업데이트
router.post('/lecipe/del', async (req, res) => {
  const db = req.app.locals.db;
  const { foodId } = req.body;

  try {
    const result = await db.execute(`
      UPDATE FOODS
      SET IS_DELETE = 'Y'
      WHERE FOOD_ID = :foodId
    `, { foodId });

    if (result.rowsAffected === 0) {
      res.status(404).send({ message: '음식을 찾을 수 없습니다.' });
    } else {
      res.status(200).send({ message: '음식이 삭제 상태로 업데이트되었습니다.' });
    }
  } catch (err) {
    console.error('음식 삭제 상태 업데이트 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});

module.exports = router;
