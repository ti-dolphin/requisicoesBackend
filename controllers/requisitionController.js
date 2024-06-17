const { json } = require("express");
const pool = require("../database");
const { executeQuery } = require("./requisitionItemController");

const requisitonController = {
  getRequisitions: async () => {
    const query = "SELECT * from WEB_REQUISICAO";
    try {
      const result = await requisitonController.executeQuery(query);
      console.log('result: ', result);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  getRequisitionByID: async (id) => {
    const query = "SELECT * from WEB_REQUISICAO where ID_REQUISICAO =" + id;
    try {
      const result = await requisitonController.executeQuery(query);
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  get_requisitions_by_osID: async (osID) => {
    const query = "SELECT * from WEB_REQUISICAO where ID_OS =" + osID;
    try {
      const result = await requisitonController.executeQuery(query);
      return result;
    } catch (err) {
      return null;
    }
  },
  insertRequisitions: async (json) => {
    //{status : cotação, description: 'tal', id_projeto: 1944, id_responsavel: 46}
    const items = json.map((item) => `('${item.STAUTS}','${item.DESCRIPTION}', ${item.ID_PROJETO}, ${item.ID_RESPONSAVEL})`);
    const query = "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL ) VALUES " + items;
    try {
      const [resultSetHeader, rows] = await requisitonController.executeQuery(query);
      console.log(resultSetHeader)
      return resultSetHeader;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  updateRequisitonById: async (requisition, id) => {
    try {
      console.log('requisition body: ', requisition);
      const query = await requisitonController.setQueryUpdate(requisition, id);
      console.log(query);
      const result = await requisitonController.executeQuery(query);
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
  },

  setQueryUpdate: async (requisition, id) => {
    return `UPDATE WEB_REQUISICAO SET DESCRIPTION = '${requisition.DESCRIPTION}', STATUS = '${requisition.STATUS}' where ID_REQUISICAO = ${id}`;
  },

  deleteRequisitionById: async (requisitionID) => {
    const query =
      "DELETE from WEB_REQUISICAO WHERE ID_REQUISICAO = " + requisitionID;
    try {
      const result = await requisitonController.executeQuery(query);
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
      throw queryError;
    }
  },
};

module.exports = requisitonController;
