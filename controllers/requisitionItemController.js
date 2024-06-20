const { json } = require("express");
const pool = require("../database");

const requisitionItemController = {

  getRequisitionItem_by_reqID: async (requisitionID) => {
    const query = `SELECT
	        dsecombr_controle.WEB_REQUISICAO_ITEMS.ID, QUANTIDADE, ID_REQUISICAO, WEB_REQUISICAO_ITEMS.ID_PRODUTO, NOME
          FROM
          dsecombr_controle.WEB_REQUISICAO_ITEMS inner join produtos ON produtos.ID = dsecombr_controle.WEB_REQUISICAO_ITEMS.ID_PRODUTO 
          WHERE ID_REQUISICAO = ${requisitionID}`
    try {
      const result = await requisitionItemController.executeQuery(query);
      console.log('RESULT: ', result);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  
  createRequisitionItems: async (json, requisitionID) => {
    const values = json.map((item) => `( ${item.QUANTIDADE}, ${requisitionID}, ${item.ID_PRODUTO} )`
    );
    const query = `INSERT INTO WEB_REQUISICAO_ITEMS (QUANTIDADE, ID_REQUISICAO, ID_PRODUTO) VALUES ${values};`;
    try {
      const [resulSetHeader, rows] = await requisitionItemController.executeQuery(query);
      console.log(resulSetHeader);
      return resulSetHeader;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  deleteRequisitionItem_by_reqID: async (requisitionID, productID) => {
    const query = `DELETE FROM WEB_REQUISICAO_ITEMS WHERE ID_REQUISICAO = ${requisitionID} AND ID_PRODUTO = ${productID}`;
    try {
      const [result] = await requisitionItemController.executeQuery(query);
      return result;
    } catch (err) {
      console.log(err);
      return null
    }
  },

  updateRequisitionItems: async (items) => {
    let resultCount = 0;
    items.map(async (item) => {
      resultCount++;
      const query = `UPDATE WEB_REQUISICAO_ITEMS SET QUANTIDADE = ${item.QUANTIDADE} WHERE ID = ${item.ID}`;
      try {
        const [result] = await requisitionItemController.executeQuery(query);
      } catch (e) {
        resultCount--;
        console.log(e);
      }
    });
    console.log('count: ', resultCount);
    return resultCount;
  },

  executeQuery: async (query) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query);
      (await connection).release();
      return result;
    } catch (queryError) {
      (await connection).release();
      console.log("ERROOO query: " + queryError);
      throw queryError;
    }
  },
}
module.exports = requisitionItemController;