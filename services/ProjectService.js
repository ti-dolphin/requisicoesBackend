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
  static async getAllProjects(userID) {
    let query = `
      SELECT * 
      FROM PROJETOS
      WHERE ATIVO = 1 AND DESCRICAO != 'null'
    `;
    let params = [];

    if (userID) {
      // Busca permissões do usuário de forma segura
      const [data] = await this.executeQuery(
        `SELECT PERM_ADMINISTRADOR, PERM_COMERCIAL FROM PESSOA WHERE CODPESSOA = ?`,
        [userID]
      );
      if (!data || !data[0]) {
        // Retorna lista vazia se usuário não encontrado
        return [];
      }
      const isAdm = Number(data[0].PERM_ADMINISTRADOR);
      const isComercial = Number(data[0].PERM_COMERCIAL);
      if (!isAdm && !isComercial) {
        // Se não for admin nem comercial, retorna apenas projetos que o usuário segue
        query += ` AND ID IN (SELECT id_projeto FROM web_seguidores_projeto WHERE codpessoa = ?)`;
        params.push(userID);
      }
      // Se for comercial ou admin, retorna todos os projetos ativos
    }
    try {
      // Executa a consulta e retorna os projetos encontrados
      const [rows] = await this.executeQuery(query, params);
      return rows;
    } catch (err) {
      // Em caso de erro, exibe no console e retorna null
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
