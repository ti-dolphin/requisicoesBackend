const pool = require("../database");

class ProductService {
  static async getProductsBySearch(search) {
    const query = `
      SELECT 
        ID, codigo, nome_fantasia 
      FROM 
        produtos 
      WHERE 
        nome_fantasia LIKE ? 
        AND inativo = 0 
        AND ultimo_nivel = 0
    `;
    try {
      const [rows, fields] = await this.executeQuery(query, [`%${search}%`]);
      console.log("getProductsBySearch - rows:  ", rows);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async executeQuery(query, params = []) {
    const connection = await pool.getConnection();
    try {
      const [results, fields] = await connection.query(query, params);
      connection.release();
      return [results, fields];
    } catch (queryError) {
      console.log("queryError: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}

module.exports = ProductService;
