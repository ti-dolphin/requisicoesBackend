const { json } = require("express");
const pool = require("../database");


const productsController = { 
    getAllProducts: async (limit, offSet) => {
        console.log('Limit: ', limit);
        console.log('OffSet ',  offSet);
        const query = `SELECT ID_PRODUTO,CODIGO, NOME FROM WEB_PRODUTOS LIMIT ${limit} OFFSET ${offSet}`;
        try{
            const  result  = await productsController.executeQuery(query);
            console.log(result);
            return result;
        }catch(e){
          console.log(e);
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
      }
}
module.exports = productsController;