const pool = require("../database");
const ItemRepository = require('../repositories/ItemRepository');
class RequisitionItemService {
  async getRequisitionItems(requisitionID) {
    const query = ItemRepository.getItemsByRequisitionID(requisitionID);
    const connection = await pool.getConnection();
    try {
      let [originalRows] = await connection.query(query, [requisitionID]);
      const responseObject = this.getItemsComparedByPrices(originalRows);
      console.log("items: ", responseObject.items.length);
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

  /**
   * Compara os itens da requisição com os itens de cotação, agrupando preços e quantidades por fornecedor.
   * Retorna todos os itens, tanto os que possuem cotação quanto os que não possuem.
   * @param {Array} originalRows - Linhas originais do banco de dados.
   * @returns {Object} - { columns: [fornecedores], items: [itens agrupados] }
   */
  getItemsComparedByPrices(originalRows) {
    // Map para agrupar itens por ID
    const itemsMap = new Map();
    // Set para armazenar fornecedores únicos
    const suppliersSet = new Set();
    // Primeiro, percorre todas as linhas para identificar fornecedores e agrupar por ID
    for (const row of originalRows) {
      const { ID, fornecedor, id_item_cotacao } = row;
      if (fornecedor) suppliersSet.add(fornecedor);
      // Se já existe o item, apenas adiciona as informações do fornecedor
      if (itemsMap.has(ID)) {
        const item = itemsMap.get(ID);
        if (fornecedor) {
          item[fornecedor] = row.preco_unitario;
          item[`quantidade_cotada_${fornecedor}`] = row.quantidade_cotada;
        }
      } else {
        // Cria uma cópia do item base
        const baseItem = { ...row };
        // Inicializa campos de fornecedores como null
        for (const supplier of suppliersSet) {
          baseItem[supplier] = null;
          baseItem[`quantidade_cotada_${supplier}`] = null;
        }
        // Preenche se já houver fornecedor
        if (fornecedor) {
          baseItem[fornecedor] = row.preco_unitario;
          baseItem[`quantidade_cotada_${fornecedor}`] = row.quantidade_cotada;
        }
        itemsMap.set(ID, baseItem);
      }
    }

    // Garante que todos os itens tenham as colunas de todos os fornecedores
    const suppliers = Array.from(suppliersSet);
    for (const item of itemsMap.values()) {
      for (const supplier of suppliers) {
        if (!(supplier in item)) item[supplier] = null;
        const qtyKey = `quantidade_cotada_${supplier}`;
        if (!(qtyKey in item)) item[qtyKey] = null;
      }
    }

    return {
      columns: suppliers,
      items: Array.from(itemsMap.values()),
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
      console.log("queries: ", queries)
      const result = await this.executeQuery(ItemRepository.update(items));
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
