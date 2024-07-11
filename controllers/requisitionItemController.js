const { json } = require("express");
const pool = require("../database");

const requisitionItemController = {
  getRequisitionItem_by_reqID: async (requisitionID) => {
    const query = `
          SELECT
            dsecombr_controle.WEB_REQUISICAO_ITEMS.ID, QUANTIDADE, OBSERVACAO, ID_REQUISICAO, WEB_REQUISICAO_ITEMS.ID_PRODUTO, nome_fantasia, codigo
            FROM
            dsecombr_controle.WEB_REQUISICAO_ITEMS inner join produtos ON produtos.ID = dsecombr_controle.WEB_REQUISICAO_ITEMS.ID_PRODUTO 
            WHERE ID_REQUISICAO = ?`;
    try {
      const [rows, fields] = await requisitionItemController.executeQuery(
        query,
        [requisitionID]
      );
      return rows;
    } catch (err) {
      console.log("Erro na query", err);
      return null;
    }
  },

  createRequisitionItems: async (json, requisitionID) => {
    const values = json.map(
      (item) => `( ${item.QUANTIDADE}, ${requisitionID}, ${item.ID_PRODUTO} )`
    );
    const query = `INSERT INTO WEB_REQUISICAO_ITEMS (QUANTIDADE, ID_REQUISICAO, ID_PRODUTO) VALUES ${values}`;
    try {
      const [resulSetHeader, rows] =
        await requisitionItemController.executeQuery(query, ['']);
      return resulSetHeader;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  deleteRequisitionItem_by_reqID: async (requisitionID, productID) => {
    const query = `DELETE FROM WEB_REQUISICAO_ITEMS WHERE ID_REQUISICAO = ? AND ID_PRODUTO = ?`;
    try {
      const [result] = await requisitionItemController.executeQuery(query, [
        requisitionID,
        productID
      ]);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  updateRequisitionItems: async (items) => {
    let resultCount = 0;
    items.map(async (item) => {
      resultCount++;
      const query = item.OBSERVACAO
        ? `UPDATE WEB_REQUISICAO_ITEMS SET QUANTIDADE = ${item.QUANTIDADE}, OBSERVACAO = '${item.OBSERVACAO}' WHERE ID = ${item.ID} `
        : `UPDATE WEB_REQUISICAO_ITEMS SET QUANTIDADE = ${item.QUANTIDADE} WHERE ID = ${item.ID}`;
      try {
        const [result] = await requisitionItemController.executeQuery(query);
      } catch (e) {
        resultCount--;
        console.log(e);
      }
    });
    console.log("count: ", resultCount);
    return resultCount;
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
module.exports = requisitionItemController;