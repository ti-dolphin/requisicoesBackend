const pool = require("../database");
const ProductRepository  = require("../repositories/ProductRepository");

class ProductService {

  static async updateProducts (data) { 
    try{ 
      const result = await this.executeQuery(ProductRepository.updateManyProducts(data));
      console.log('result: ', result);
      return result;
    }catch(e){ 
      console.log(e);
      return null;
    }
  }

  static async getProductsBySearch(search, typeId) {
    const params = Number(typeId) ? [typeId, `%${search}%`] : [`%${search}%`];
    try {
      const query = ProductRepository.searchProductsQuery(typeId);
      console.log("query", query)
      const [rows, fields] = await this.executeQuery(
        query,
        params
      );
      console.log("rows", rows.length)
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
