const oracledb = require('oracledb');

oracledb.initOracleClient({libDir: 'C:/oracle/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4'}); // Instant Client 경로 설정
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


const conn = await oracledb.getConnection({
    user          : "Insa5_App_hacksim_1",
    password      : "aischool1",
    connectString : "project-db-stu3.smhrd.com:1524/XE"
})

module.exports = conn;

