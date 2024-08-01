const pool = require("../database");

class ProjectService {
  static async getAllProjects() {
    const query = `
      SELECT 
        * 
      FROM 
        PROJETOS
    `;
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
