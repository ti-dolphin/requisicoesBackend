const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "35.247.196.108",
  user: "dse_controle_user",
  database: "dsecombr_controle",
  password: "dse54@74",
  port: 3306,
  waitForConnections: true,
  timezone: "Z",
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
  
module.exports = pool;
