const pool = require("../database");

class PersonService {
    
  static async getAllPersons() {
    const personTable = "pessoa".toUpperCase();
    const query = `
      SELECT NOME, CODPESSOA 
      FROM ${personTable} 
      WHERE ATIVO = 1
    `;
    try {
      const [rows, fields] = await PersonService.executeQuery(query);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async getPersonByID(id) {
    const personTable = "pessoa".toUpperCase();
    const query = `
      SELECT NOME, CODPESSOA 
      FROM ${personTable} 
      WHERE CODPESSOA = ?
    `;
    try {
      const [rows, fields] = await PersonService.executeQuery(query, [id]);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  
  static async executeQuery(query, params = []) {
    const connection = await pool.getConnection();
      const result = await connection.query(query, params);
      connection.release();
      return result;
  }
}

module.exports = PersonService;
