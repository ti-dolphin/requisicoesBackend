const RequisitionItemService = require("../services/RequisitionItemService");

class RequisitionItemController {
  static async getRequisitionItemByReqID(req, res) {
    try {
      const { requisitionID } = req.params;
      const items = await RequisitionItemService.getRequisitionItems(
        requisitionID
      );
      res.status(200).json(items);
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao buscar itens de requisição");
    }
  }

  static async createRequisitionItems(req, res) {
    try {
      const { requisitionID } = req.params;
      const result = await RequisitionItemService.createRequisitionItems(
        req.body,
        requisitionID
      );
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao criar itens de requisição");
    }
  }

  static async deleteRequisitionItem(req, res) {
    try {
      const { requisitionID, productID } = req.params;
      const result = await RequisitionItemService.deleteRequisitionItem(
        requisitionID,
        productID
      );
      if (result) res.status(200).send("Item deletado com sucesso");
      else res.status(404).send("Item não encontrado");
    } catch (err) {
      res.status(500).send("Erro ao deletar item de requisição");
    }
  }

  static async updateRequisitionItems(req, res) {
    try {
      const resultCount = await RequisitionItemService.updateRequisitionItems(req.body);
      res.status(200).send(`${resultCount} itens atualizados com sucesso`);
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao atualizar itens de requisição");
    }
  }
}

module.exports = RequisitionItemController;
