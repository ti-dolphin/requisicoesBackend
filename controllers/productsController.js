const { json } = require("express");
const pool = require("../database");


const productsController = { 
     getAllProducts: async (limit, offSet) => {
         const query = `SELECT ID_PRODUTO ,codigo, NOME FROM produtos where inativo = 0 LIMIT ${limit} OFFSET ${offSet} `;
         try{
             const  result  = await productsController.executeQuery(query);
             console.log(result);
             return result;
         }catch(e){
           console.log(e);
             return null;
         }
     },
    getProductsBySearch : async (search) => { 
      const query = `SELECT ID_PRODUTO,codigo,NOME FROM produtos WHERE NOME LIKE '%${search}%' and inativo = 0`;
      try{ 
        const result = await productsController.executeQuery(query);
        return result;
      }catch(e){ 
        console.log(e);
        return null
      }
    },
    executeQuery: async (query) => {
        const connection = pool.getConnection();
        try {
          const result = (await connection).query(query);
          (await connection).release();
          return result;
        } catch (queryError) {
          console.log(queryError)
          (await connection).release();
          throw queryError;
        }
      }
}
module.exports = productsController;