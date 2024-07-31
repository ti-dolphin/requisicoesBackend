const { json } = require("express");
const pool = require("../database");

const projectController = {
  getAllProjects: async () => {
    const query = "SELECT * FROM PROJETOS";
    try {
      const [rows, fields] = await projectController.executeQuery(query);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  getProjectById: async (id) => {
    const query = `SELECT * FROM PROJETOS WHERE ID = ?`;
    try {
      const [rows, fields] = await projectController.executeQuery(query, [id]);
      return rows;
    } catch (err) {
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
module.exports = projectController;