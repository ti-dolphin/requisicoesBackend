const pool = require("../database");
const ItemRepository = require('../repositories/ItemRepository');
class RequisitionItemService {
  async getRequisitionItems(requisitionID) {
    const query = ItemRepository.getItemsByRequisitionID(requisitionID);
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(query, [requisitionID]);
      return rows;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async createRequisitionItems(items, requisitionID) {
    const query = ItemRepository.createItems(items, requisitionID);
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query);
      const productIds = items.map((item) => item.ID_PRODUTO);
      const [insertedItems] = await connection.query(`
        SELECT * FROM WEB_REQUISICAO_ITEMS WHERE ID_PRODUTO IN (${productIds.join(',')})`);
      return insertedItems;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteRequisitionItem(requisitionID, idsParam) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(ItemRepository.delete(idsParam), [
        requisitionID
      ]);
      return result;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async updateRequisitionItems(items) {
    const connection = await pool.getConnection();
    try {
      const queries = ItemRepository.update(items);
      const result = await connection.query(ItemRepository.update(items))
      if(result){ 
        return result.length
      }
     
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new RequisitionItemService();
