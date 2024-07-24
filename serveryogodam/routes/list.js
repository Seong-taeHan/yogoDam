const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const conn = require('../config/database');

// 상품 목록 조회
router.get('/products', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const result = await db.execute('SELECT * FROM FOODS');
    console.log(result.rows);
    res.status(200).send(result.rows);
    console.log("list -> DB 데이터 연결 확인");
  } catch (err) {
    console.error('상품 목록 조회 오류:', err);
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
      introduction,
      cookTime,
      category1,
      category2,
      thumbnail, // Base64 인코딩된 이미지
      ingredients,
      steps = [] // 기본값으로 빈 배열을 설정
    } = req.body;

    const thumbnailBuffer = Buffer.from(thumbnail, 'base64');

    // 레시피 데이터를 데이터베이스에 저장하는 로직 작성
    const insertRecipeSql = `
      INSERT INTO FOODS (user_id, food_name, food_img, cook_time, upload_date, is_delete, food_price, cusine_type, cooking_method, nick_name)
      VALUES (:user_id, :title, :thumbnail, :cookTime, SYSDATE, 'N', 0, :category1, :category2, :nickName)
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

module.exports = router;