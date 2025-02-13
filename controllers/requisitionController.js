const RequisitionService = require("../services/RequisitionService");
const userController = require("./userController");

class RequisitionController {

  static async getTypes(req, res){ 
    const types = await RequisitionService.getTypes();
    if (types) {
      return res.status(200).json(types);
    } else {
      return res.status(500).json({ error: "Erro ao buscar tipos" });
    }
  }

  static async getRequisitions(req, res) {
    
    const { userID, currentKanbanFilter } = req.query;
    const requisitions = await RequisitionService.getRequisitions(
      userID,
      currentKanbanFilter
    );
    if (requisitions) {
      return res.status(200).json(requisitions);
    } else {
      return res.status(500).json({ error: "Erro ao buscar requisições" });
    }
  }

  static async getRequisitionByID(req, res) {
    const { id } = req.params;
    const requisition = await RequisitionService.getRequisitionByID(id);
    if (requisition) {
      return res.status(200).json(requisition);
    } else {
      
      return res.status(500).json({ error: "Erro ao buscar requisição" });
    }
  }

  static async insertRequisitions(req, res) {
    const result = await RequisitionService.insertRequisitions(req.body);
    if (result) {
      return res.status(201).json(result.insertId);
    } else {
      return res.status(500).json({ error: "Erro ao inserir requisições" });
    }
  }

  static async updateRequisitionById(req, res) {
    const { codpessoa, requisition } = req.body;
    const result = await RequisitionService.updateRequisitionById(
      codpessoa,
      requisition
    );
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ error: "Erro ao atualizar requisição" });
    }
  }

  static async deleteRequisitionById(req, res) {
    const { requisitionID } = req.params;
    const result = await RequisitionService.deleteRequisitionById(
      requisitionID
    );
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json({ error: "Erro ao deletar requisição" });
    }
  }
}

module.exports = RequisitionController;
