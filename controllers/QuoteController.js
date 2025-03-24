
const QuoteService = require("../services/QuoteService");

class QuoteController {
    static async getQuoteById(req, res){ 
        try {
            const { quoteId } = req.params;
            const quote = await QuoteService.getQuoteById(quoteId);
            return res.status(200).json(quote);
        } catch (error) {
            console.log('ERRO COTAÇÂO: ', error.message)
            return res.status(500).json({ error: error.message });
        }
    }
    // Método para obter uma cotação (GET)
    static async getQuotes(req, res) {
        try {
            const quotes = await QuoteService.getQuotes(req, res);
            return res.status(200).json(quotes);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Método para criar uma cotação (POST)
    static async create(req, res) {
        try {
            const newQuote = await QuoteService.create(req, res);
            return res.status(200).json(newQuote);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Método para atualizar uma cotação (PUT)
    static async update(req, res) {
        try {
            const updatedQuote = await QuoteService.update(req, res);
            return res.status(200).json(updatedQuote);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async updateItems(req, res){ 
        try{
            const updatedItems = await QuoteService.updateItems(req, res);
            return res.status(200).send(updatedItems);
        }catch(e){ 
            console.log(e)
            return res.status(500).json({ error: e.message });
        }
    }
}

module.exports = QuoteController;