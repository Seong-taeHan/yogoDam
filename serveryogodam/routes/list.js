const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const conn = require('../config/database');
const fs = require('fs');
const path = require('path');

// Base64 문자열을 디코딩하여 파일로 저장하는 함수
const saveBase64Image = (base64String, filePath) => {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
};

// 상품 목록 조회
router.get('/products', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const result = await db.execute('SELECT * FROM FOODS'); // 예시 쿼리입니다. 실제 쿼리는 데이터베이스 스키마에 맞게 수정해야 합니다.
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
      thumbnail,
      ingredients,
      steps = [] // 기본값으로 빈 배열을 설정
    } = req.body;

    // 썸네일 이미지 디코딩 및 저장
    let thumbnailPath = null;
    if (thumbnail) {
      thumbnailPath = path.join(__dirname, '../uploads', `${title}_thumbnail.png`);
      saveBase64Image(thumbnail, thumbnailPath);
    }

    // 요리 순서 이미지 디코딩 및 저장
    steps.forEach((step, index) => {
      if (step.image) {
        const stepPath = path.join(__dirname, '../uploads', `${title}_step_${index + 1}.png`);
        saveBase64Image(step.image, stepPath);
      }
    });

    // 레시피 데이터를 데이터베이스에 저장하는 로직 작성
    const insertRecipeSql = `
      INSERT INTO RECIPES (user_id, nickName, title, introduction, cookTime, category1, category2, thumbnail_path)
      VALUES (:user_id, :nickName, :title, :introduction, :cookTime, :category1, :category2, :thumbnail_path)
    `;
    await db.execute(insertRecipeSql, [user_id, nickName, title, introduction, cookTime, category1, category2, thumbnailPath], { autoCommit: true });

    // 레시피 ID 가져오기 (이 예제는 간단하게 title을 사용합니다. 실제로는 고유 ID를 사용해야 합니다)
    const recipeId = title;

    // 재료 데이터를 데이터베이스에 저장하는 로직 작성
    const insertIngredientSql = `
      INSERT INTO INGREDIENTS (recipeId, name, amount, unit)
      VALUES (:recipeId, :name, :amount, :unit)
    `;
    for (const ingredient of ingredients) {
      await db.execute(insertIngredientSql, [recipeId, ingredient.name, ingredient.amount, ingredient.unit], { autoCommit: true });
    }

    // 요리 순서 데이터를 데이터베이스에 저장하는 로직 작성
    const insertStepSql = `
      INSERT INTO STEPS (recipeId, stepOrder, description, imagePath)
      VALUES (:recipeId, :stepOrder, :description, :imagePath)
    `;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await db.execute(insertStepSql, [recipeId, i + 1, step.description, step.image ? `${title}_step_${i + 1}.png` : null], { autoCommit: true });
    }

    res.status(200).send({ message: '레시피가 성공적으로 저장되었습니다.' });
  } catch (err) {
    console.error('레시피 작성 오류:', err);
    res.status(500).send({ message: '서버 오류' });
  }
});

module.exports = router;