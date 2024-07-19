const express = require('express')
const app = express()
const oracledb = require('oracledb')

oracledb.initOracleClient({libDir: 'C:/oracle/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4'}); // Instant Client 경로 설정
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const server = app.listen(4000, () => {
    console.log('server start, port 4000')
})
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

app.get('/select', function(request, response) {
    getSelect(request, response)
})

async function getSelect(request, response) {
    let connection
    try {
        connection = await oracledb.getConnection({
            user          : "Insa5_App_hacksim_1",
            password      : "aischool1",
            connectString : "project-db-stu3.smhrd.com:1524/XE"
        })

        const result = await connection.execute(
            `SELECT * 
            FROM BOARD
            WHERE BOARDNUM = :num`,
            [1], // num의 값 전달
        )

        console.log(result)
        response.send(result.rows)
    } catch (error) {
        console.log(error)
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (error) {
                console.log(error)
            }
        }
    }
}