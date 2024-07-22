const express = require('express');
const router = express.Router();
const conn = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { autoCommit } = require('oracledb');

router.post('/login', async (req, res) => {
    console.log('/login : ', req.body);
    const { user_id, user_pw } = req.body;
    const db = req.app.locals.db;

    try {
        const sql = `SELECT user_pw FROM users WHERE user_id = :user_id`;
        const user = await db.execute(sql, [user_id]);

        if (user.rows.length === 0) {
            return res.status(401).send({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        const hashedPassword = user.rows[0].user_pw;
        const isPasswordMatch = await bcrypt.compare(user_pw, hashedPassword);

        if (!isPasswordMatch) {
            return res.status(401).send({ message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }

        const token = jwt.sign({ user_id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).send({ message: '로그인 성공', token });
    } catch (err) {
        console.error('로그인 오류', err);
        res.status(500).send({ message: '서버 연결 오류' });
    }
})

router.post('/join', async (req, res) => {
    console.log('/joindata', req.body);
    const {user_id, user_pw, user_name, user_email, user_phone, nick_name} = req.body;
    const db = req.app.locals.db;

    try {
        const hashedPassword = await bcrypt.hash(user_pw, 10);
        const sql = `INSERT INTO users (user_id, user_pw, user_name, user_email, user_phone, joined_at, nick_name) VALUES (:user_id, :user_pw, :user_name, :user_email, :user_phone, SYSDATE, :nick_name)`;
        await db.execute(
            sql, [user_id, hashedPassword, user_name, user_email, user_phone, nick_name],
            { autoCommit: true }
        );
        res.status(201).send({ message: `${nick_name} 계정 생성` });
    } catch(err) {
        console.error('회원 가입 오류:', err);
        res.status(500).send({ message: `${nick_name} 서버 연결 오류` });
    }
});

router.post('/idCheck', async (req, res) => {
    console.log('/idCheck', req.body);
    const { user_id } = req.body;
    const db = req.app.locals.db;

    try {
        const sql = `SELECT COUNT(*) AS count FROM users WHERE user_id = :user_id`;
        const idCheckRes = await db.execute(sql, [user_id]);
        
        const count = idCheckRes.rows[0].COUNT || idCheckRes.rows[0].count;
        if (count > 0) {
            res.status(200).send({ message: '사용중인 아이디 입니다.', available: false });
        } else {
            res.status(200).send({ message: '사용 가능한 아이디 입니다.', available: true });
        }
    } catch (err) {
        console.error('중복체크 오류', err);
        res.status(500).send({ message: '서버 연결 오류' });
    }
});

module.exports = router;