const { json } = require("express");
const pool = require("../database");


const pessoaController = {
  getAllPersons: async () => {
    const personTable = 'pessoa'.toUpperCase();
        const query = `SELECT NOME, CODPESSOA FROM ${personTable} WHERE ATIVO = 1`;
        try{ 
            const [rows, fields] = await pessoaController.executeQuery(query);
            return rows;
        }catch(e){
            console.log(e);
            return null
        }
  },
    getPersonByID: async (id) => {
        const personTable = 'pessoa'.toUpperCase();
        const query = `SELECT NOME, CODPESSOA FROM ${personTable} where CODPESSOA = ${id} `;
        try{ 
            const [rows, fields] = await pessoaController.executeQuery(query);
            return rows;
        }catch(e){
            console.log(e);
            return null;
        }
  },
  executeQuery: async (query) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query);
      (await connection).release();
      return result;
    } catch (queryError) {
       (await connection).release();
       throw queryError;
    }
  },
};

module.exports = pessoaController;