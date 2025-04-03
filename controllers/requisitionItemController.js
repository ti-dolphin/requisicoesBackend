const RequisitionItemService = require("../services/RequisitionItemService");

class RequisitionItemController {
  static async getRequisitionItemByReqID(req, res) {
    try {
      const { requisitionID } = req.params;
      const data = await RequisitionItemService.getRequisitionItems(
        requisitionID
      );
      res.status(200).json(data);
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao buscar itens de requisição");
    }
  }

  static async createRequisitionItems(req, res) {
    try {
      const { requisitionID } = req.params;
      const insertedItems = await RequisitionItemService.createRequisitionItems(
        req.body,
        requisitionID
      );
      res.status(201).json({ insertedItems  });
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao criar itens de requisição");
    }
  }

  static async deleteRequisitionItems(req, res) {
    try {
       const { ids } = req.query;
       const idsParam = ids.join(',');
      const { requisitionID } = req.params;
      const result = await RequisitionItemService.deleteRequisitionItem(
        requisitionID,
        idsParam
      );
      if (result) return res.status(200).send("Item deletado com sucesso");
      else return res.status(404).send("Item não encontrado");
    } catch (err) {
      return res.status(500).send("Erro ao deletar item de requisição");
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
