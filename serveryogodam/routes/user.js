const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const { autoCommit } = require('oracledb');

router.post('/login', (req, res) => {
    console.log(req.body);
})

router.post('/join', async (req, res) => {
    console.log('/joindata', req.body);
    const {user_id, user_pw, user_name, user_email, user_phone, nick_name} = req.body;
    const db = req.app.locals.db;

    try {
        const sql = `INSERT INTO users (user_id, user_pw, user_name, user_email, user_phone, joined_at, nick_name) VALUES (:user_id, :user_pw, :user_name, :user_email, :user_phone, SYSDATE, :nick_name)`
        const idCheckRes = await db.execute(
            sql, [user_id, user_pw, user_name, user_email, user_phone, nick_name],
            {autoCommit: true}
        )
        res.status(201).send({message: `${nick_name}계정 생성`})
    } catch(err) {
        console.error('회원 가입 오류:', err);
        res.status(500).send({ message: `${nick_name}서버 연결 오류` });
    }

})

router.post('/idCheck', async (req, res) => {
    console.log('/idCheck', req.body);
    const {user_id} = req.body
})

module.exports = router;