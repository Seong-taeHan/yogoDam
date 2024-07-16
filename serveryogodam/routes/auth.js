// backend/routes/auth.js
const express = require('express');
const oracledb = require('oracledb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// DB config 가져오기
const dbConfig = require('../server').get('dbConfig');

// 회원가입 API
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `INSERT INTO users (username, password) VALUES (:username, :password)`,
            [username, hashedPassword]
        );
        await connection.commit();
        res.status(201).send('User created');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT password FROM users WHERE username = :username`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const hashedPassword = result.rows[0][0];
        const isMatch = await bcrypt.compare(password, hashedPassword);
        
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;