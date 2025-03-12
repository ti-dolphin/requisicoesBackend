const pool = require("../database");

class PersonService {

  static async getClients(projectId ){ 
    let query;

    if (Number(projectId) !== 0){ 
      query = `
        SELECT CODCLIENTE, NOMEFANTASIA FROM ORDEMSERVICO OS
        INNER JOIN PROJETOS P ON P.ID = OS.ID_PROJETO
        INNER JOIN ADICIONAIS A ON OS.ID_ADICIONAL = A.ID
        INNER JOIN CLIENTE C ON C.CODCLIENTE = OS.FK_CODCLIENTE
        where OS.ID_PROJETO = ${projectId} AND A.NUMERO = 0
      `
      console.log('PROJECT ID QUERY: ', query)
    }else  { 
      query = `
      SELECT CODCLIENTE, NOMEFANTASIA FROM CLIENTE WHERE CODCLIENTE IN (
        SELECT FK_CODCLIENTE FROM dsecombr_controle.ORDEMSERVICO OS INNER JOIN
          PROJETOS P ON P.ID = OS.ID_PROJETO WHERE
          P.ATIVO = 1
      );
    `;
    }
    try {
      const [rows, fields] = await PersonService.executeQuery(query);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async getSallers ( projectId){ 
    const personTable = "pessoa".toUpperCase();
    let query;
    if (Number(projectId)){ 
      query = `
      SELECT  P.NOME, P.CODPESSOA FROM ORDEMSERVICO OS INNER JOIN ADICIONAIS A ON A.ID = OS.ID_ADICIONAL
      INNER JOIN PESSOA P ON P.CODPESSOA = OS.RESPONSAVEL
      where OS.ID_PROJETO = ${projectId} and A.NUMERO = 0
     `
    }else{ 
      query = `
      SELECT NOME, CODPESSOA 
      FROM ${personTable}
      WHERE PERM_COMERCIAL = 1
    `;
    }
    
    try {
      const [rows, fields] = await PersonService.executeQuery(query);
      return rows;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
    
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
