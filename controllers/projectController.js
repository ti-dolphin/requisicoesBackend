const { json } = require("express");
const pool = require("../database");


const projectController = { 
    getAllProjects : async  () => {
        const query  = 'SELECT * FROM PROJETOS';
        try {
          const result = await projectController.executeQuery(query);
          return result;
        } catch (err) {
          return null;
    }
},
    getProjectById: async (id) => { 
        const query  = `SELECT * FROM PROJETOS WHERE ID = ${id}`;
        try {
          const result = await projectController.executeQuery(query);
          return result;
        } catch (err) {
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
  }
}
module.exports = projectController;