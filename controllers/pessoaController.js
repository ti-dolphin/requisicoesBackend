const { json } = require("express");
const pool = require("../database");


const pessoaController = {
  getAllPersons: async () => {
    const personTable = "pessoa".toUpperCase();
    const query = `SELECT NOME, CODPESSOA FROM ${personTable} WHERE ATIVO = 1`;
    try {
      const [rows, fields] = await pessoaController.executeQuery(query);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  getPersonByID: async (id) => {
    const personTable = "pessoa".toUpperCase();
    const query = `SELECT NOME, CODPESSOA FROM ${personTable} where CODPESSOA = ? `;
    try {
      const [rows, fields] = await pessoaController.executeQuery(query, [id]);
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

module.exports = pessoaController;