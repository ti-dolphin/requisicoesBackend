class ItemRepository {
  static update(items) {
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
    return queries;
  }
  static delete() {
    return `DELETE FROM WEB_REQUISICAO_ITEMS
      WHERE ID_REQUISICAO = ? AND ID_PRODUTO = ?`;
  }
  static createItems(items, requisitionID) {
    const values = items
      .map(
        (item) => `( ${item.QUANTIDADE}, ${requisitionID}, ${item.ID_PRODUTO} )`
      )
      .join(", ");
    return ` INSERT INTO WEB_REQUISICAO_ITEMS (QUANTIDADE, ID_REQUISICAO, ID_PRODUTO)
      VALUES ${values};
    `;
  }
  static getItemsByRequisitionID() {
    return` SELECT
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
        ID_REQUISICAO = ?;`;
  }
}
module.exports = ItemRepository;
