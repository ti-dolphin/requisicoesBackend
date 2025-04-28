const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "35.247.196.108",
  user: "dse_controle_user",
  database: "dsecombr_controle",
  password: "dse54@74",
  port: 3306,
  waitForConnections: true,
  timezone: "Z",
  connectionLimit: 20, // Aumentar para suportar mais conexões simultâneas
  maxIdle: 10,
  idleTimeout: 30000, // Reduzir para liberar conexões ociosas mais rápido
  queueLimit: 50, // Limitar a fila para evitar espera indefinida
  enableKeepAlive: true,
  keepAliveInitialDelay: 30000, // Atrasar keep-alive para reduzir overhead
  multipleStatements: true,
  connectTimeout: 20000, // 20 segundos para estabelecer conexão
});

module.exports = pool;
