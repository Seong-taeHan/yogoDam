const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

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

// dbConfig를 전역에서 사용할 수 있도록 설정
app.set('dbConfig', dbConfig);

// 라우트 설정
app.use('/api', authRoutes);

// 서버 실행
app.listen(4000, () => {
    console.log('서버가 4000번 포트에서 실행 중입니다.');
});