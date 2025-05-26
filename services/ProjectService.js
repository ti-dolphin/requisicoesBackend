const pool = require("../database");

class ProjectService {

  static async createProject(project){ 
      const {descricao } = project;
      const [result] = await this.executeQuery(
        `
          INSERT INTO PROJETOS (DESCRICAO, ATIVO)
          VALUES (?,1)
        `,
        [descricao]
      );
    return result.insertId;
  }
  // Busca todos os projetos ativos, com regras baseadas nas permissões do usuário
  static async getAllProjects(userID, context) {
    //query inicialmente busca todos os projetos ativos
    let query = `
      SELECT * 
      FROM PROJETOS
      WHERE ATIVO = 1 AND DESCRICAO != 'null'
    `;
    let params = [];

    if (userID) {
      const [user] = await this.executeQuery(`SELECT PERM_ADMINISTRADOR, PERM_COMERCIAL, CODGERENTE FROM PESSOA WHERE CODPESSOA = ?`,[userID]);
      console.log(user);
      const isAdm = Number(user[0].PERM_ADMINISTRADOR);
      if (!isAdm) { 
        query += `
        AND (
        ID IN (SELECT ID FROM PROJETOS WHERE CODGERENTE = ?)
        OR ID IN (SELECT ID_PROJETO FROM ORDEMSERVICO OS WHERE OS.RESPONSAVEL = ?) 
        OR ID IN (SELECT id_projeto FROM web_seguidores_projeto WHERE codpessoa = ?) 
        )`;
        params.push(user[0].CODGERENTE);
        params.push(userID);
        params.push(userID);
       
      }
    }

    //retorna todos
    try {
      const [rows] = await this.executeQuery(query, params);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async getProjectById(id) {
    const query = `
      SELECT 
        * 
      FROM 
        PROJETOS 
      WHERE 
        ID = ?
    `;
    try {
      const [rows, fields] = await this.executeQuery(query, [id]);
      return rows;
    } catch (err) {
      console.log(err);
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

module.exports = ProjectService;
