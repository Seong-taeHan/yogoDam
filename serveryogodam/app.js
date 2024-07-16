const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth'); // 라우트 import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OracleDB 연결 설정
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
};

// DB config를 전역에서 사용할 수 있도록 설정
app.set('dbConfig', dbConfig);

// 라우트 설정
app.use('/api', authRoutes); // /api 경로로 auth 라우트 사용

// 서버 실행
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});