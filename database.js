const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "35.198.25.52",
  user: "homolog-user",
  database: "dsecombr_controle",
  password: "password",
  port: 3306,
  waitForConnections: true,
  timezone: "Z",
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true
}); 

module.exports = pool;
