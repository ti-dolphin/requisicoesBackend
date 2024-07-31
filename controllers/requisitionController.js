const RequisitionService = require("../services/RequisitionService");
const userController = require("./userController");

class RequisitionController {
  static async getRequisitions(req, res) {
    const { userID, currentKanbanFilter } = req.query;
    const requisitions = await RequisitionService.getRequisitions(
      userID,
      currentKanbanFilter
    );
    if (requisitions) {
      res.status(200).json(requisitions);
    } else {
      res.status(500).json({ error: "Erro ao buscar requisições" });
    }
  }

  static async getRequisitionByID(req, res) {
    const { id } = req.params;
    const requisition = await RequisitionService.getRequisitionByID(id);
    if (requisition) {
      res.status(200).json(requisition);
    } else {
      res.status(500).json({ error: "Erro ao buscar requisição" });
    }
  }

  static async insertRequisitions(req, res) {
    const result = await RequisitionService.insertRequisitions(req.body);
    if (result) {
      res.status(201).json(result.insertId);
    } else {
      res.status(500).json({ error: "Erro ao inserir requisições" });
    }
  }

  static async updateRequisitionById(req, res) {
    const result = await RequisitionService.updateRequisitionById(req.body);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Erro ao atualizar requisição" });
    }
  }

  static async deleteRequisitionById(req, res) {
    const { requisitionID} = req.params;
    const result = await RequisitionService.deleteRequisitionById(
      requisitionID
    );
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Erro ao deletar requisição" });
    }
  }
}

module.exports = RequisitionController;
