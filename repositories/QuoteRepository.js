class QuoteRepository { 

    static createQuoteQuery = ( ) => { 
        return `
            INSERT INTO web_cotacao (id_requisicao,
                    descricao,
                    fornecedor)
            VALUES (?, ?, ?)
        `
    }

    static getQuoteByIdQuery = ( ) => { 
        return `
                    SELECT
                c.id_cotacao,
                c.id_requisicao,
                c.fornecedor,
                c.data_cotacao,
                c.observacao,
                c.descricao,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_item_cotacao', i.id_item_cotacao,
                        'descricao_item', i.descricao_item,
                        'preco_unitario', i.preco_unitario,
                        'quantidade', i.quantidade,
                        'subtotal', i.subtotal,
                        'id_item_requisicao', i.id_item_requisicao
                    )
                ) AS items
            FROM
                web_cotacao c
                LEFT JOIN web_items_cotacao i ON c.id_cotacao = i.id_cotacao
            WHERE c.id_cotacao = ?
            GROUP BY
                c.id_cotacao, c.id_requisicao, c.fornecedor, c.data_cotacao, c.observacao;
    
        `
    }

    static getQuotes = ( ) => { 
        return `
            SELECT * FROM web_cotacao;
        `
    }

    static createQuoteItems = (items, quoteId) => { 
        let query = `INSERT INTO web_items_cotacao (id_cotacao ,id_item_requisicao, quantidade, descricao_item) VALUES`;
        const values = [];
        for (let item of items) {   
            const {
                ID, //id_item_requisicao
                QUANTIDADE, //quantidade
                nome_fantasia, //descricao_item
            } = item;
            values.push(`(${quoteId}, ${ID}, ${QUANTIDADE}, '${nome_fantasia}')`);
        }
        query += values.join(', ');
        return query;
    }

    static updateQuoteQuery = ( ) => { 
        return `
            UPDATE  web_cotacao SET fornecedor = ?, observacao = ?, descricao = ? WHERE
            id_cotacao = ?
        `
    }

    static updateItemsQuery = ( items) =>  {
        // Inicia a construção da query
        let query = '';
        // Itera sobre cada item do array
        items.forEach(item => {
            // Calcula o subtotal (preco_unitario * quantidade)
            query += `
            UPDATE web_items_cotacao
            SET
                descricao_item = '${item.descricao_item.trim()}', -- Remove espaços em branco extras
                preco_unitario = ${item.preco_unitario},
                quantidade = ${item.quantidade},
                observacao = '${item.observacao || 'Sem observação'}' -- Observação padrão se não for fornecida
            WHERE id_item_cotacao = ${item.id_item_cotacao};

        `;
        });
        // Retorna a query completa
        return query.trim(); // Remove espaços em branco extras no início e no final
    }
}
module.exports = QuoteRepository