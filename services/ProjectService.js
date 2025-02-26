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
  static async getAllProjects(userID) {
    let isAdm;
    let query;
    if(userID){ 
      const [data] = await this.executeQuery(`SELECT PERM_ADMINISTRADOR FROM PESSOA where CODPESSOA = ${userID}`);
      isAdm = Number(data[0].PERM_ADMINISTRADOR);
    }

    if (userID && !isAdm) {
      console.log(' não adm')
      query = `
      SELECT 
        * 
      FROM 
        PROJETOS
      WHERE ATIVO = 1 AND DESCRICAO != 'null'
      and
      ID IN (SELECT id_projeto from web_seguidores_projeto where codpessoa = ${userID});
    `
    } else {
      console.log('adm')
      query = ` SELECT 
        * 
      FROM 
        PROJETOS
      WHERE ATIVO = 1 AND DESCRICAO != 'null'`;
    }

    try {
      const [rows, fields] = await this.executeQuery(query);
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
