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
    const items = json.map((item) => `('${item.status}','${item.description}', ${item.id_projeto}, ${item.id_responsavel})`);
    const query = "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL ) VALUES " + items;
    try {
      const [resultSetHeader, rows ]= await requisitonController.executeQuery(query);
      console.log(resultSetHeader)
      return resultSetHeader;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  updateRequisitonById: async (json, id) => {
    try {
       const query = await requisitonController.setQueryUpdate(json, id);
       console.log(query);
       const result = await requisitonController.executeQuery(query); 
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
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

  setQueryUpdate: async (json, id) => {
    //update format body [{responsable: json, description: 'text'} ]
    const responsableName = json[0].id_responsavel;
    const description = json[0].description;
    helpQuery = `SELECT CODPESSOA FROM PESSOA WHERE NOME = '${responsableName}'`;
    const [personCodesArr, columns] = await requisitonController.executeQuery(helpQuery);
    const personCode = personCodesArr[0].CODPESSOA;
    return `UPDATE WEB_REQUISICAO SET DESCRIPTION = '${description}', ID_RESPONSAVEL = ${personCode} where ID_REQUISICAO = ${id}`;

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
