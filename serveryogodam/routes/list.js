const express = require('express');
const router = express.Router();
const conn = require('../config/database');


router.get('/products', async (req, res) => {
    const db = req.app.locals.db;

    try {
        const result = await db.execute('SELECT * FROM FOODS');  // 예시 쿼리입니다. 실제 쿼리는 데이터베이스 스키마에 맞게 수정해야 합니다.
        console.log(result.rows); // 이게 없어서 변수명을 못 불러왔던거였음 ㅠㅠㅠ 미친
        res.status(200).send(result.rows);
        console.log("list -> DB 데이터 연결 확인") ;
    } catch (err) {
        console.error('상품 목록 조회 오류:', err);
        res.status(500).send({ message: '서버 오류' });
    }
});

module.exports = router;

