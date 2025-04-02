const QuoteRepository = require("../repositories/QuoteRepository");
const pool = require("../database");

class QuoteService {

    static getShipmentTypes = async (  ) => { 
        try{ 
            const data = await this.executeQuery(QuoteRepository.getShipmentTypes());
            return data;
        }catch(e){ 
            console.log(e.message)
            throw e;
        }
    }

    static getFiscalClassifications = async ( ) => {
         try{ 
             const data = await this.executeQuery(QuoteRepository.getFiscalClassifications())
             return data;
         }catch(e){ throw e}
    }

    static getQuotesByRequisitionId = async (requisitionId ) => { 
        try{ 
            const quotes = await this.executeQuery(QuoteRepository.getQuotesByRequisitionId(), [requisitionId]);
            return quotes;
        }catch(e){ 
            throw e;
        }
    }

    static async getQuoteById(quoteId) {
        const [quote] = await this.executeQuery(
            QuoteRepository.getQuoteByIdQuery(),
            [quoteId]
        );
        if (!quote) {
            throw new Error("Cotação não encontrada.");
        }
        return quote;
    }

    static async getQuotes(req, res) {
        const [quotes] = await this.executeQuery(
            QuoteRepository.getQuotesQuery()
        );
        return quotes;
    }

    static async create(req, res) {
        const { items, requisitionId, descricao, fornecedor } = req.body;
        try {
            const quoteInsertResult = await this.executeQuery(
                QuoteRepository.createQuoteQuery(),
                [
                    requisitionId,
                    descricao,
                    fornecedor
                ]
            );
            const { insertId } = quoteInsertResult;
            if (items) {
                const itemsInsertResult = await this.executeQuery(
                    QuoteRepository.createQuoteItems(items, insertId),
                );
            }
            const newQuote = await this.getQuoteById(insertId);
            console.log({newQuote})
            return newQuote;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    static async update(req, res) {
        const {quoteId} = req.params; 
        console.log('req body: ', req.body)
        const { fornecedor, observacao, descricao, id_tipo_frete, id_classificacao_fiscal, valor_frete, cnpj_fornecedor, cnpj_faturamento } = req.body;
        if (!fornecedor && !observacao) {
            throw new Error("Pelo menos um campo (fornecedor ou observação) deve ser fornecido para atualização.");
        }

        const result = await this.executeQuery(
            QuoteRepository.updateQuoteQuery(),
            [fornecedor, observacao, descricao, id_tipo_frete, id_classificacao_fiscal, valor_frete, cnpj_fornecedor, cnpj_faturamento, quoteId]
        );
        if (result.affectedRows === 0) {
            throw new Error("Cotação não encontrada ou não atualizada.");
        }
        const [updatedQuote] = await this.executeQuery(
            QuoteRepository.getQuoteByIdQuery(),
            [quoteId]
        );
        return updatedQuote;
    }

    static async updateItems(req, res){ 
        const items = req.body;
        const {quoteId} = req.params;
        try{    
            const [result] = await this.executeQuery(QuoteRepository.updateItemsQuery(items),
            );
            if(result.affectedRows){ 
                const quote = await this.getQuoteById(quoteId);
                return quote.items;
            }
        }catch(e){ 
            throw e;
        }
    }

    static async executeQuery(query, params) {
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

module.exports = QuoteService;