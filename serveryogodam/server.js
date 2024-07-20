const express = require('express');
const app = express();
const cors = require('cors');
const initialize = require('./config/database'); 
// const oracledb = require('oracledb');

// oracledb.initOracleClient({libDir: 'C:/oracle/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4'}); // Instant Client 경로 설정
// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const indexRouter = require('./routes');
app.use('/', indexRouter);

const userRouter = require('./routes/user');
app.use('/user', userRouter);

initialize().then((conn) => {
    app.locals.db = conn;
    app.use('/', indexRouter);
    app.use('/user', userRouter);


    app.set('port', process.env.PORT || 8000);
    app.listen(app.get('port'), ()=>{
        console.log(`Server is running on ${app.get('port')}`);
    });
}).catch(err => {
    console.error(`데이터 베이스 연결 실패 : ${err}`);
})
