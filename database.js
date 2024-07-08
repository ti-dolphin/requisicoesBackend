const mysql = require('mysql2/promise');
//  host: "35.247.196.108",
//   user: "dse_controle_user",
//   database: "dsecombr_controle",
//   password: "dse54@74",
const pool = mysql.createPool({
  host: "localhost",
  user: "dudu",
  database: "dsecombr_controle",
  password: "247156",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
  
module.exports = pool;