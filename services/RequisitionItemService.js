const pool = require("../database");
const ItemRepository = require('../repositories/ItemRepository');
class RequisitionItemService {
  async getRequisitionItems(requisitionID) {
    const query = ItemRepository.getItemsByRequisitionID(requisitionID);
    const connection = await pool.getConnection();
    try {
     
      let [originalRows] = await connection.query(query, [requisitionID]);
      const responseObject = this.getItemsComparedByPrices(originalRows);
      console.log('rows: ', responseObject.rows)
      return responseObject;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

   getItemsComparedByPrices(originalRows){ 
    let composedRows = [];
    let columns = [];
    let quoteItemIds = [];
    
    for (let row of originalRows) {
      const { fornecedor } = row;
      const { id_item_cotacao } = row;
      if(id_item_cotacao){ 
        quoteItemIds.push(id_item_cotacao);
      }
      if(fornecedor){ 
        const notInColumns = !(columns.indexOf(fornecedor) > -1)
        if (notInColumns) {
          columns.push(fornecedor);
        }
      }
    }

    for (let quoteItemId of quoteItemIds) {
      let quoteIdRow = originalRows.find(r => r.id_item_cotacao === quoteItemId);
      const notInComposedRows = !(composedRows.find(r => quoteIdRow.ID === r.ID));
      columns.forEach((c) => {
        quoteIdRow = {
          ...quoteIdRow,
          [c]: null
        }
      });
      if (!(quoteItemIds.length > 0)){ 
        return { 
          columns: [],
          rows: originalRows
        };
      }
      const itemIdRows = [];
      originalRows.forEach((r) => {
        const sameIdRow = r.ID === quoteIdRow.ID;
        if (sameIdRow) {
          itemIdRows.push(r);
        }
      });
      itemIdRows.forEach((itemIdRow) => {
        const columnToInsertPrice = Object.keys(quoteIdRow).filter(key => key === itemIdRow.fornecedor);
        quoteIdRow = {
          ...quoteIdRow,
          [columnToInsertPrice]: itemIdRow.preco_unitario
        }
      });
      if (notInComposedRows) {
        composedRows.push(quoteIdRow);
      }
    }

    return { 
      columns, 
      items : quoteItemIds.length > 0 ? composedRows : originalRows
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
      console.log('items: ', items)
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
