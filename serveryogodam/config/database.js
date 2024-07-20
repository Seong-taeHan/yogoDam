const oracledb = require('oracledb');

async function initialize() {
  try {
    oracledb.initOracleClient({ libDir: 'C:/oracle/instantclient-basic-windows.x64-23.4.0.24.05/instantclient_23_4' });
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    const conn = await oracledb.getConnection({
      user: "Insa5_App_hacksim_1",
      password: "aischool1",
      connectString: "project-db-stu3.smhrd.com:1524/XE"
    });

    console.log('Database connected');
    return conn;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

module.exports = initialize;