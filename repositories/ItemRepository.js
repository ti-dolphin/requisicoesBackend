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
  static delete(idsParam) {
    console.log(`DELETE FROM WEB_REQUISICAO_ITEMS
      WHERE ID_REQUISICAO = ? AND ID_PRODUTO IN (${idsParam});`)
    return `DELETE FROM WEB_REQUISICAO_ITEMS
      WHERE ID_REQUISICAO = ? AND ID IN (${idsParam});`;
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
    // return` SELECT
    //     dsecombr_controle.WEB_REQUISICAO_ITEMS.ID,
    //     QUANTIDADE,
    //     OBSERVACAO,
    //     UNIDADE,
    //     OC,
    //     ID_REQUISICAO,
    //     ATIVO,
    //     WEB_REQUISICAO_ITEMS.ID_PRODUTO,
    //     nome_fantasia,
    //     codigo
    //   FROM
    //     dsecombr_controle.WEB_REQUISICAO_ITEMS
    //   INNER JOIN
    //     produtos
    //   ON
    //     produtos.ID = dsecombr_controle.WEB_REQUISICAO_ITEMS.ID_PRODUTO
    //   WHERE
    //     ID_REQUISICAO = ?;`;
    return `
         SELECT IR.ID, IR.OC, IR.QUANTIDADE, IR.ID_PRODUTO, IR.ATIVO,
          P.nome_fantasia, P.codigo, P.unidade,
          C.fornecedor,
          IC.preco_unitario, IC.OBSERVACAO, IC.id_item_cotacao 
         FROM WEB_REQUISICAO_ITEMS IR
LEFT JOIN web_items_cotacao IC on IR.ID = IC.id_item_requisicao
LEFT JOIN web_cotacao C on C.id_cotacao = IC.id_cotacao
INNER JOIN produtos P on P.ID = IR.ID_PRODUTO
WHERE IR.ID_REQUISICAO = ?
    `
  }
}
module.exports = ItemRepository;
