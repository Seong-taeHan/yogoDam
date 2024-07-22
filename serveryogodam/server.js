const express = require('express');
const app = express();
const cors = require('cors');
const conn = require('./config/database');
// const oracledb = require('oracledb');

// oracledb.initOracleClient({libDir: 'C:/oracle/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4'}); // Instant Client 경로 설정
// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

conn().then((connection) => {
    app.locals.db = connection;
    const indexRouter = require('./routes');
    app.use('/', indexRouter);

    const userRouter = require('./routes/user');
    app.use('/user', userRouter);

    const listRouter = require('./routes/list');
    app.use('/list', listRouter);

    app.set('port', process.env.PORT || 8000);
    app.listen(app.get('port'), ()=>{
        console.log(`Server is running on ${app.get('port')}`);
    });
}).catch(err => {
    console.log("서버 연결 실패")
})


