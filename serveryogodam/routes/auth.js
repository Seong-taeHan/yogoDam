const express = require('express');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
};

// 회원가입 API
router.post('/register', async (req, res) => {
    const { user_id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `INSERT INTO users (user_id, password) VALUES (:user_id, :password)`,
            [user_id, hashedPassword]
        );
        await connection.commit();
        res.status(201).send('사용자 생성 완료');
    } catch (err) {
        console.error(err);
        res.status(500).send('사용자 생성 중 오류 발생');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    const { user_id, password } = req.body;

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT password FROM users WHERE user_id = :user_id`,
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('사용자를 찾을 수 없습니다.');
        }

        const hashedPassword = result.rows[0][0];
        const isMatch = await bcrypt.compare(password, hashedPassword);
        
        if (!isMatch) {
            return res.status(400).send('잘못된 자격 증명입니다.');
        }

        const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('로그인 중 오류 발생');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

module.exports = router;