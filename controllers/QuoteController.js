
const QuoteService = require("../services/QuoteService");

class QuoteController {

  

    static async deleteQuoteFileById(req, res) {
        try {
          const { fileId } = req.params;
          await QuoteService.deleteQuoteFileById(fileId);
          return res.status(200).json({ message: "File deleted successfully" });
        } catch (error) {
          console.log("Error deleting quote file:", error.message);
          return res.status(500).json({ error: error.message });
        }
      }


  static getFilesByQuoteId = async (req, res) => {
    try {
      const { quoteId } = req.params;
      const files = await QuoteService.getFilesByQuoteId(quoteId);
      return res.status(200).send(files);
    } catch (e) {
      console.log("Error fetching files by quote ID:", e.message);
      return res.status(500).json({ error: e.message });
    }
  };

  static createQuoteFile = async (req, res) => {
    try {
      const quoteFile = await QuoteService.createQuoteFile(req);
      return res.status(200).send(quoteFile);
    } catch (e) {
      console.log("Error creating quote file:", e.message);
      return res.status(500).json({ error: e.message });
    }
  };

  static getShipmentTypes = async (req, res) => {
    try {
      const shipmentTypes = await QuoteService.getShipmentTypes();
      return res.status(200).send(shipmentTypes);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };

  static getFiscalClassifications = async (req, res) => {
    try {
      const FiscalClassifications =
        await QuoteService.getFiscalClassifications();
      console.log("FiscalClassifications:", FiscalClassifications);
      return res.status(200).send(FiscalClassifications);
    } catch (e) {
      console.log("ERRO COTAÇÂO: ", e.message);

      return res.status(500).json({ error: e.message });
    }
  };

  static getQuotesByRequisitionId = async (req, res) => {
    try {
      const { requisitionId } = req.params;
      const quotes = await QuoteService.getQuotesByRequisitionId(requisitionId);
      return res.status(200).send(quotes);
    } catch (e) {
      console.log("ERRO COTAÇÂO: ", error.message);
      return res.status(500).json({ error: error.message });
    }
  };

  static async getQuoteById(req, res) {
    try {
      const { quoteId } = req.params;
      const quote = await QuoteService.getQuoteById(quoteId);
      return res.status(200).json(quote);
    } catch (error) {
      console.log("ERRO COTAÇÂO: ", error.message);
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
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateItems(req, res) {
    try {
      const updatedItems = await QuoteService.updateItems(req, res);
      return res.status(200).send(updatedItems);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }
}

module.exports = QuoteController;