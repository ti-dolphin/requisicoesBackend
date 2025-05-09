const RequisitionItemService = require("../services/RequisitionItemService");

class RequisitionItemController {
  static getItemToSupplierMapByReqId = async ( req, res) => { 
    try {
      const { reqId } = req.params;
      const itemToSupplierMap = await RequisitionItemService.getItemToSupplierMapByReqId(reqId);
      console.log('itemToSupplierMap: ', itemToSupplierMap);
      return res.status(200).send(itemToSupplierMap);
    } catch (e) {
      console.log("Erro ao buscar itens: ", e);
      return res.status(500).send("Erro ao buscar itens");
    }
  };

  static updateItemToSupplier = async (req, res) => {
    try {
      const itemToSupplierMap = req.body;
      const {reqId} = req.params;
      const updatedMap = await RequisitionItemService.udpateItemToSupplier(
        itemToSupplierMap,
        reqId
      );
      console.log("updatedMap: ", updatedMap);
      return res.status(200).send(updatedMap);
    } catch (e) {
      console.log("Erro ao salvar preços: ", e);
      return res.status(500).send("Erro ao salvar preços");
    }
  };

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
      res.status(201).json({ insertedItems });
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao criar itens de requisição");
    }
  }

  static async deleteRequisitionItems(req, res) {
    try {
      const { ids } = req.query;
      const idsParam = ids.join(",");
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
      const resultCount = await RequisitionItemService.updateRequisitionItems(
        req.body
      );
      res.status(200).send(`${resultCount} itens atualizados com sucesso`);
    } catch (err) {
      console.error("Erro no controller", err);
      res.status(500).send("Erro ao atualizar itens de requisição");
    }
  }
}

module.exports = RequisitionItemController;
