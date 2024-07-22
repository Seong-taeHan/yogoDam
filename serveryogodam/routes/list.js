const express = require('express');
const router = express.Router();
const conn = require('../config/database');


router.get('/products', async (req, res) => {
    const db = req.app.locals.db;

    try {
        const result = await db.execute('SELECT * FROM products');  // 예시 쿼리입니다. 실제 쿼리는 데이터베이스 스키마에 맞게 수정해야 합니다.
        res.status(200).send(result.rows);
    } catch (err) {
        console.error('상품 목록 조회 오류:', err);
        res.status(500).send({ message: '서버 오류' });
    }
});

module.exports = router;
