const { json } = require("express");
const pool = require("../database");


const productsController = { 
     getAllProducts: async (limit, offSet) => {
         const query = `SELECT ID ,codigo, nome_fantasia FROM produtos where inativo = 0 AND ultimo_nivel = 1 LIMIT ${limit} OFFSET ${offSet} `;
         try{
             const  [rows, fields]  = await productsController.executeQuery(query);
             console.log(rows);
             return rows;
         }catch(e){
           console.log(e);
             return null;
         }
     },
    getProductsBySearch : async (search) => { 
      const query = `SELECT ID,codigo,nome_fantasia FROM produtos WHERE nome_fantasia LIKE '%${search}%' and inativo = 0`;
      try{ 
        const [rows, fields] = await productsController.executeQuery(query);
        return rows;
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