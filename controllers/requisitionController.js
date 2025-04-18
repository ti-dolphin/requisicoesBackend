const RequisitionService = require("../services/RequisitionService");
const userController = require("./userController");

class RequisitionController {


  static async getStatusChangesByRequisition(req, res) {
    try {
      const { requisitionID } = req.params;
      const statusChanges = await RequisitionService.getStatusChangesByRequisition(requisitionID);
      if (statusChanges) {
      return res.status(200).json(statusChanges);
      } else {
      return res.status(404).json({ error: "Status changes not found" });
      }
    } catch (e) {
      console.log("Erro ao buscar alterações de status da requisição", e);
      return res.status(500).json({ error: "Erro ao buscar alterações de status da requisição" });
    }
    }

  static async getStatusList(req, res) {
    console.log("getStatusList");
    try {
      const statusList = await RequisitionService.getStatusList();
      return res.status(200).send(statusList);
    } catch (e) {
      console.log("Erro ao buscar lista de status");
      return res.status(500).json({ error: "Erro ao buscar lista de status" });
    }
  }

  static async getTypes(req, res) {
    const types = await RequisitionService.getTypes();
    if (types) {
      return res.status(200).json(types);
    } else {
      return res.status(500).json({ error: "Erro ao buscar tipos" });
    }
  }

  static async getRequisitions(req, res) {
    const { user, currentKanbanFilter } = req.query;
    const requisitions = await RequisitionService.getRequisitions();
    if (requisitions) {
      return res.status(200).json(requisitions);
    } else {
      return res.status(500).json({ error: "Erro ao buscar requisições" });
    }
  }

  static async getRequisitionByID(req, res) {
    try {
      const { id } = req.params;
      const requisition = await RequisitionService.getRequisitionByID(id);
      return res.status(200).json(requisition);
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar dados da requisição" });
    }
  }

  static async insertRequisitions(req, res) {
    const result = await RequisitionService.insertRequisitions(req.body);
    try {
      if (result) {
        return res.status(201).json(result.insertId);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Erro ao criar requisição" });
    }
  }

  static async updateRequisitionById(req, res) {
    const { codpessoa, requisition, justification, id_status_anterior } = req.body;
    const result = await RequisitionService.updateRequisitionById(
      codpessoa,
      requisition,
      justification,
      id_status_anterior
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
