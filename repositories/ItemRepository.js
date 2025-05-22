const utils = require('../utils');
class ItemRepository {
  static update(items) {
    console.log("items: ", items);
    const queries = items
      .map(
        (item) => { 
          const date = utils.getSQLFormatedDate(item.data_entrega);
         return `
              UPDATE WEB_REQUISICAO_ITEMS
              SET
                  QUANTIDADE = ${item.QUANTIDADE},
                  OBSERVACAO = '${item.OBSERVACAO}',
                  ID_PRODUTO = ${item.ID_PRODUTO},
                  data_entrega = ${date ? date : null},
                  OC = ${item.OC},
                  ATIVO = ${item.ATIVO}    
              WHERE
                  ID = ${item.ID};
              `;
        })
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

    return `
            SELECT
              IR.ID, 
              IR.OC,
              IR.QUANTIDADE,
              IR.ID_PRODUTO, 
              IR.ATIVO,
              IR.id_item_cotacao_selecionado,
              IR.data_entrega,
              P.nome_fantasia, P.codigo, P.unidade,
              C.fornecedor,
              C.valor_frete,
              IC.preco_unitario,
              IC.OBSERVACAO,
              IC.id_item_cotacao,
              IC.quantidade_cotada,
              IC.ICMS,
              IC.ST,
              IC.IPI,
              C_SELECIONADO.valor_frete,
              JSON_OBJECT(
                'id_item_cotacao', IC_SELECIONADO.id_item_cotacao,
                'id_cotacao', IC_SELECIONADO.id_cotacao,
                'descricao_item', IC_SELECIONADO.descricao_item,
                'preco_unitario', IC_SELECIONADO.preco_unitario,
                'quantidade_solicitada', IC_SELECIONADO.quantidade_solicitada,
                'subtotal', IC_SELECIONADO.subtotal,
                'id_item_requisicao', IC_SELECIONADO.id_item_requisicao,
                'observacao', IC_SELECIONADO.observacao,
                'ICMS', IC_SELECIONADO.ICMS,
                'IPI', IC_SELECIONADO.IPI,
                'ST', IC_SELECIONADO.ST,
                'quantidade_cotada', IC_SELECIONADO.quantidade_cotada,
                'id_produto', IC_SELECIONADO.id_produto,
                'fornecedor', C_SELECIONADO.fornecedor,
                'valor_frete', C_SELECIONADO.valor_frete
              ) AS item_cotacao_selecionado
            FROM WEB_REQUISICAO_ITEMS IR
    LEFT JOIN web_items_cotacao IC on IR.ID = IC.id_item_requisicao
    LEFT JOIN  web_items_cotacao IC_SELECIONADO ON IC_SELECIONADO.id_item_cotacao = IR.id_item_cotacao_selecionado
    LEFT JOIN web_cotacao C_SELECIONADO on C_SELECIONADO.id_cotacao = IC_SELECIONADO.id_cotacao
    LEFT JOIN web_cotacao C on C.id_cotacao = IC.id_cotacao
    INNER JOIN produtos P on P.ID = IR.ID_PRODUTO
    WHERE IR.ID_REQUISICAO = ?
    `;
  }
}
module.exports = ItemRepository;
