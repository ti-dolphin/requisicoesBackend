const pool = require("../database");

class RequisitionItemService {
  async getRequisitionItems(requisitionID) {
    const query = `
      SELECT
        dsecombr_controle.WEB_REQUISICAO_ITEMS.ID,
        QUANTIDADE,
        OBSERVACAO,
        UNIDADE,
        OC,
        ID_REQUISICAO,
        ATIVO,
        WEB_REQUISICAO_ITEMS.ID_PRODUTO,
        nome_fantasia,
        codigo
      FROM
        dsecombr_controle.WEB_REQUISICAO_ITEMS
      INNER JOIN
        produtos
      ON
        produtos.ID = dsecombr_controle.WEB_REQUISICAO_ITEMS.ID_PRODUTO
      WHERE
        ID_REQUISICAO = ?;
    `;
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
    const values = items
      .map(
        (item) => `( ${item.QUANTIDADE}, ${requisitionID}, ${item.ID_PRODUTO} )`
      )
      .join(", ");

    const query = `
      INSERT INTO WEB_REQUISICAO_ITEMS (QUANTIDADE, ID_REQUISICAO, ID_PRODUTO)
      VALUES ${values};
    `;
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query);
      return result;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteRequisitionItem(requisitionID, productID) {
    const query = `
      DELETE FROM WEB_REQUISICAO_ITEMS
      WHERE ID_REQUISICAO = ? AND ID_PRODUTO = ?;
    `;
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, [
        requisitionID,
        productID,
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
    const queries = items
      .map(
        (item) => `
      UPDATE WEB_REQUISICAO_ITEMS
      SET
        QUANTIDADE = ${item.QUANTIDADE},
        OBSERVACAO = '${item.OBSERVACAO}',
        ID_PRODUTO = ${item.ID_PRODUTO},
        OC = ${item.OC},
        ATIVO = ${item.ATIVO}
      WHERE
        ID = ${item.ID};
    `
      )
      .join("\n");

    const connection = await pool.getConnection();
    try {
      const result = await connection.query(queries);
      return result.length;
    } catch (err) {
      console.error("Erro na query", err);
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = new RequisitionItemService();
