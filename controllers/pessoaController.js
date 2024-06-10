const { json } = require("express");
const pool = require("../database");


const pessoaController = {
  getAllPersons: async () => {
    const personTable = 'pessoa'.toUpperCase();
        const query = `SELECT NOME, CODPESSOA FROM ${personTable}`;
        try{ 
            const result = await pessoaController.executeQuery(query);
            return result;
        }catch(e){
            console.log(e);
            return null
        }
  },
    getPersonByID: async (id) => {
        const personTable = 'pessoa'.toUpperCase();
        const query = `SELECT NOME, CODPESSOA FROM ${personTable} where CODPESSOA = ${id} `;
        try{ 
            const result = await pessoaController.executeQuery(query);
            return result;
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
      console.log("ERROOO query: " + queryError);
      throw queryError;
    }
  },
};

module.exports = pessoaController;