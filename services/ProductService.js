const pool = require("../database");

class ProductService {
  static async getProductsBySearch(search, typeId) {
    const query = `
    SELECT 
          ID, codigo, nome_fantasia, produtos.familia
      FROM 
          produtos 
      INNER JOIN
          web_familia_tipo 
          ON web_familia_tipo.familia = produtos.familia
      INNER JOIN 
          web_tipo_requisicao
          ON web_tipo_requisicao.id_tipo_requisicao = web_familia_tipo.id_tipo_requisicao
      WHERE 
          web_tipo_requisicao.id_tipo_requisicao = ? 
          AND nome_fantasia LIKE ? 
          AND inativo = 0 
          AND ultimo_nivel = 0
      ORDER BY 
          nome_fantasia ASC
    `;
    try {
      const [rows, fields] = await this.executeQuery(query, [typeId ,`%${search}%`]);
      console.log({rows})
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
