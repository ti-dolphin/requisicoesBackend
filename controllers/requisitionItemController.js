const { json } = require("express");
const pool = require("../database");

const requisitionItemController = {

    getRequisitionItem_by_reqID: async (requisitionID) =>{
        const id = "id".toUpperCase();
        const productId = "web_requisicao_items.id_produto".toUpperCase();
        const itemsTable = "dsecombr_controle." + "web_requisicao_items".toUpperCase();
        const productsTable = "web_produtos".toUpperCase();
        const query = `SELECT ${id}, quantidade, id_requisicao, nome, ${productId} FROM ${itemsTable} inner join ${productsTable} where ${productsTable}.id_produto = ${itemsTable}.id_produto and id_requisicao = ${requisitionID}`;
        console.log(query);
        try{
            const result = await requisitionItemController.executeQuery(query);
            console.log(result);
            return result;
        }catch(err){
          console.log(err);
            return null;
        }
    },
    createRequisitionItems: async (json, requisitionID) =>{
      const values = json.map(( item ) => `( ${item.quantidade }, ${ requisitionID }, ${item.id_produto} )`
      );
      const query = `INSERT INTO WEB_REQUISICAO_ITEMS (QUANTIDADE, ID_REQUISICAO, ID_PRODUTO) VALUES ${values};`;
      try{
        const [resulSetHeader, rows ] = await requisitionItemController.executeQuery(query);
        console.log(resulSetHeader);
        return resulSetHeader;
      }catch(err){
        console.log(err);
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
          console.log("ERROOO query: " + queryError);
          throw queryError;
        }
      },   
}
module.exports = requisitionItemController;