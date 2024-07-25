const { json } = require("express");
const pool = require("../database");

const productsController = {

  getProductsBySearch: async (search) => {
    const query = `SELECT ID,codigo,nome_fantasia FROM produtos WHERE nome_fantasia LIKE '%${search}%' and inativo = 0 and ultimo_nivel = 0`;
    try {
      const [rows, fields] = await productsController.executeQuery(query, [
        ''
      ]);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  executeQuery: async (query, params) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query, params);
      (await connection).release();
      return result;
    } catch (queryError) {
      console
        .log(
          "queryErro: ",
          queryError
        )(await connection)
        .release();
      throw queryError;
    }
  },
};
module.exports = productsController;
