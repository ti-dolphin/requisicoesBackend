class QuoteRepository {

static deleteQuoteFileByIdQuery = () => {
    return `
                DELETE FROM web_anexo_cotacao
                WHERE id_anexo_cotacao = ?;
        `;
};

  static getFilesByQuoteIdQuery = ( ) => { 
    return `
        SELECT
            id_anexo_cotacao,
            id_cotacao,
            nome_arquivo,
            url
        FROM
            web_anexo_cotacao
        WHERE
            id_cotacao = ?;
    `;
  };

  static getQuoteFileById = () => {
    return `
            SELECT
                id_anexo_cotacao,
                id_cotacao,
                nome_arquivo,
                url
            FROM
                web_anexo_cotacao
            WHERE
                id_anexo_cotacao = ?;
        `;
  };

  static createQuoteFile = () => {
    return `INSERT INTO web_anexo_cotacao (id_cotacao, nome_arquivo, url) VALUES (?, ?, ?)`;
  };

  static getShipmentTypes = () => {
    return `
            SELECT * FROM dsecombr_controle.web_tipo_frete;
        `;
  };

  static getFiscalClassifications = () => {
    return `
            SELECT * FROM dsecombr_controle.web_classificacao_fiscal;
        `;
  };

  static getQuotesByRequisitionId = () => {
    return `
            SELECT
                c.*,
                TF.nome AS nome_frete,
                SUM(i.subtotal) + c.valor_frete AS total, -- Soma correta
                COUNT(i.id_item_cotacao) AS quantidade_itens
            FROM
                web_cotacao c
            LEFT JOIN web_tipo_frete TF ON TF.id_tipo_frete = c.id_tipo_frete
            LEFT JOIN
                web_items_cotacao i ON c.id_cotacao = i.id_cotacao
            WHERE
                c.id_requisicao = ?
            GROUP BY
                c.id_cotacao, c.valor_frete, TF.nome -- Adicionar c.valor_frete e TF.nome ao GROUP BY
            ORDER BY
                c.id_cotacao;
        `;
  };

  static createQuoteQuery = () => {
    return `
            INSERT INTO web_cotacao (id_requisicao,
                    descricao,
                    fornecedor)
            VALUES (?, ?, ?)
        `;
  };

  static getQuoteByIdQuery = () => {
    return `
                    SELECT
                c.id_cotacao,
                c.id_requisicao,
                c.fornecedor,
                c.data_cotacao,
                c.observacao,
                c.descricao,
                c.id_classificacao_fiscal,
                c.id_tipo_frete,
                c.valor_frete,
                c.cnpj_fornecedor,
                c.cnpj_faturamento,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_item_cotacao', i.id_item_cotacao,
                        'descricao_item', i.descricao_item,
                        'preco_unitario', i.preco_unitario,
                        'ICMS', i.ICMS,
                        'IPI', i.IPI,
                        'ST', i.ST,
                        'quantidade_solicitada', i.quantidade_solicitada,
                        'quantidade_cotada', i.quantidade_cotada,
                        'subtotal', i.subtotal,
                        'id_item_requisicao', i.id_item_requisicao,
                        'observacao', i.observacao
                    )
                ) AS items
            FROM
                web_cotacao c
                LEFT JOIN web_items_cotacao i ON c.id_cotacao = i.id_cotacao
            WHERE c.id_cotacao = ?
            GROUP BY
                c.id_cotacao, c.id_requisicao, c.fornecedor, c.data_cotacao, c.observacao;
    
        `;
  };

  static getQuotes = () => {
    return `
            SELECT * FROM web_cotacao;
        `;
  };

  static createQuoteItems = (items, quoteId) => {
    let query = `INSERT INTO web_items_cotacao (id_cotacao ,id_item_requisicao, quantidade_solicitada, quantidade_cotada,  descricao_item) VALUES`;
    const values = [];
    for (let item of items) {
      const {
        ID, //id_item_requisicao
        QUANTIDADE, //quantidade
        nome_fantasia, //descricao_item
      } = item;
      values.push(
        `(${quoteId}, ${ID}, ${QUANTIDADE}, ${QUANTIDADE}, '${nome_fantasia}')`
      );
    }
    query += values.join(", ");
    return query;
  };

  static updateQuoteQuery = () => {
    return `
            UPDATE  web_cotacao SET fornecedor = ?, observacao = ?, descricao = ?, id_tipo_frete = ?, id_classificacao_fiscal = ?, valor_frete = ?, cnpj_fornecedor = ?, cnpj_faturamento = ?  WHERE
            id_cotacao = ?
        `;
  };

  static updateItemsQuery = (items) => {
    // Inicia a construção da query
    let query = "";
    // Itera sobre cada item do array
    items.forEach((item) => {
      // Calcula o subtotal (preco_unitario * quantidade)
      query += `
            UPDATE web_items_cotacao
            SET
                descricao_item = '${item.descricao_item.trim()}', -- Remove espaços em branco extras
                preco_unitario = ${item.preco_unitario},
                quantidade_cotada = ${item.quantidade_cotada},
                quantidade_solicitada = ${item.quantidade_solicitada},
                ICMS = ${item.ICMS},
                IPI = ${item.IPI},
                ST = ${item.ST},
                subtotal = ${item.subtotal},
                observacao = '${
                  item.observacao || "Sem observação"
                }' -- Observação padrão se não for fornecida
            WHERE id_item_cotacao = ${item.id_item_cotacao};

        `;
    });
    // Retorna a query completa
    return query.trim(); // Remove espaços em branco extras no início e no final
  };
}
module.exports = QuoteRepository