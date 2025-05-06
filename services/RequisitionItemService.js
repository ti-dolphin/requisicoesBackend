const pool = require("../database");
const ItemRepository = require('../repositories/ItemRepository');
class RequisitionItemService {
  async getRequisitionItems(requisitionID) {
    const query = ItemRepository.getItemsByRequisitionID(requisitionID);
    const connection = await pool.getConnection();
    try {
      let [originalRows] = await connection.query(query, [requisitionID]);
      console.log('originalRows: ', originalRows);
      const responseObject = this.getItemsComparedByPrices(originalRows);
      console.log("req items: ", responseObject.rows);
      return responseObject;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async getItemToSupplierMapByReqId(reqId) {
    const itemToSupplier = await this.executeQuery(`
        SELECT ID, fornecedor as supplier from WEB_REQUISICAO_ITEMS IR
         LEFT join web_items_cotacao IC on IR.id_item_cotacao_selecionado = IC.id_item_cotacao
         inner join web_cotacao WC on WC.id_cotacao = IC.id_cotacao
         where IR.ID_REQUISICAO = ${reqId}
    `);
    return itemToSupplier;
  }

  async udpateItemToSupplier(itemToSupplierMap, reqId) {
     
    const itemIds = itemToSupplierMap.map((item) => item.ID);
    const quoteItems = await this.executeQuery(`
            SELECT id_item_cotacao, id_item_requisicao, fornecedor as supplier FROM web_items_cotacao IC inner JOIN  
            web_cotacao WC on WC.id_cotacao = IC.id_cotacao 
            where id_item_requisicao in (${itemIds.join(",")})
      `);
    

    for (let itemToSupplierObj of itemToSupplierMap) {
      const matchingQuoteItem = quoteItems.find(
        (quoteItem) =>
          quoteItem.id_item_requisicao === itemToSupplierObj.ID &&
          quoteItem.supplier === itemToSupplierObj.supplier
      );
      await this.executeQuery(
        `UPDATE WEB_REQUISICAO_ITEMS SET id_item_cotacao_selecionado = ${matchingQuoteItem.id_item_cotacao}
              WHERE ID = ${itemToSupplierObj.ID}
             `
      );
    }
    const obj = await this.getRequisitionItems(reqId);
   
    for(let reqItem of obj.items){ 
        const matchingItemToSupplier = itemToSupplierMap.find(itemToSupplierObj => itemToSupplierObj.ID === reqItem.ID);
        if(!matchingItemToSupplier){ 
          await this.executeQuery(`
              UPDATE WEB_REQUISICAO_ITEMS SET id_item_cotacao_selecionado = 0
              WHERE ID = ${reqItem.ID}
          `)
        }
    }

    const updatedMap = await this.executeQuery(
      `SELECT ID, fornecedor as supplier from WEB_REQUISICAO_ITEMS IR
         LEFT join web_items_cotacao IC on IR.id_item_cotacao_selecionado = IC.id_item_cotacao
         inner join web_cotacao WC on WC.id_cotacao = IC.id_cotacao
         where IR.ID in (${itemIds.join(",")})
        `
    );

    return updatedMap;
  }

  getItemsComparedByPrices(originalRows) {
    let composedRows = [];
    let columns = [];
    let quoteItemIds = [];

    for (let row of originalRows) {
      const { fornecedor } = row;
      const { id_item_cotacao } = row;
      if (id_item_cotacao) {
        quoteItemIds.push(id_item_cotacao);
      }
      if (fornecedor) {
        const notInColumns = !(columns.indexOf(fornecedor) > -1);
        if (notInColumns) {
          columns.push(fornecedor);
        }
      }
    }

    for (let quoteItemId of quoteItemIds) {
      let quoteIdRow = originalRows.find(
        (r) => r.id_item_cotacao === quoteItemId
      );
      const notInComposedRows = !composedRows.find(
        (r) => quoteIdRow.ID === r.ID
      );
      columns.forEach((c) => {
        quoteIdRow = {
          ...quoteIdRow,
          [c]: null,
        };
      });
      if (!(quoteItemIds.length > 0)) {
        return {
          columns: [],
          rows: originalRows,
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
        const columnToInsertPrice = Object.keys(quoteIdRow).filter(
          (key) => key === itemIdRow.fornecedor
        );
         let columnToInsertQuotedQuantity = 'quantidade_cotada';
         columnToInsertQuotedQuantity = `${columnToInsertQuotedQuantity}_${itemIdRow.fornecedor}`;
        quoteIdRow = {
          ...quoteIdRow,
          [columnToInsertPrice]: itemIdRow.preco_unitario,
          [columnToInsertQuotedQuantity]: itemIdRow.quantidade_cotada,
        };
      });
      if (notInComposedRows) {
        composedRows.push(quoteIdRow);
      }
    }

    return {
      columns,
      items: quoteItemIds.length > 0 ? composedRows : originalRows,
    };
  }

  async createRequisitionItems(items, requisitionID) {
    const query = ItemRepository.createItems(items, requisitionID);
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query);
      const productIds = items.map((item) => item.ID_PRODUTO);
      const [insertedItems] = await connection.query(`
        SELECT * FROM WEB_REQUISICAO_ITEMS WHERE ID_PRODUTO IN (${productIds.join(
          ","
        )})`);
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
        requisitionID,
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
      const result = await connection.query(ItemRepository.update(items));
      if (result) {
        return result.length;
      }
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      connection.release();
      throw queryError;
    }
  }
}

module.exports = new RequisitionItemService();
