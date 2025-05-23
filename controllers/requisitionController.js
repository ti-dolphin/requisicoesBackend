const RequisitionService = require("../services/RequisitionService");

class RequisitionController {

  static async getRequisitionKanban(req, res){ 
    try {
       const kanbans = await RequisitionService.getRequisitionKanban();
       return res.status(200).json(kanbans);
    } catch (e) {
      return res.status(500).json({
        error: e.message,
      });
    }
  }

  static async getPreviousStatus(req, res) {
    try {
      const { requisitionID } = req.params;
      const previousStatus = await RequisitionService.getPreviousStatus(
        requisitionID
      );
      if (previousStatus) {
        return res.status(200).json(previousStatus);
      }
      return res
        .status(404)
        .json({ error: "status anterior da requisição não encontrado" });
    } catch (e) {
      console.log("Erro ao buscar status anterior da requisição", e);
      return res
        .status(500)
        .json({ error: "Erro ao buscar status anterior da requisição" });
    }
  }

  static async getStatusChangesByRequisition(req, res) {
    try {
      const { requisitionID } = req.params;
      const statusChanges =
        await RequisitionService.getStatusChangesByRequisition(requisitionID);
      if (statusChanges) {
        return res.status(200).json(statusChanges);
      } else {
        return res.status(404).json({ error: "Status changes not found" });
      }
    } catch (e) {
      console.log("Erro ao buscar alterações de status da requisição", e);
      return res
        .status(500)
        .json({ error: "Erro ao buscar alterações de status da requisição" });
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
    const { user, kanban, subFilter } = req.query;
    console.log({ user, kanban, subFilter });
    const requisitions = await RequisitionService.getRequisitions(user, kanban, subFilter);
    if (requisitions) {
      return res.status(200).json(requisitions);
    } else {
      return res.status(500).json({ error: "Erro ao buscar requisições" });
    }
  }

  static async getStatusAction(req, res) { 
   
    try{ 
      const acao = await RequisitionService.getStatusAction(req.query.user, req.query.requisition);
      return res.status(200).json({permissao: acao});
    }catch(e){ 
      console.log('ERRO AO PEGAR ACAO: ', e)
      return res
        .status(500)
        .json({ error: "Erro ao buscar dados da requisição" });
    }
  }

  static async getRequisitionByID(req, res) {
    try {
      const { id, user } = req.params;
      const requisition = await RequisitionService.getRequisitionByID(id, user);
      return res.status(200).json(requisition);
    } catch (e) {
      console.log('Erro ao buscar dados da requisição: ', e)
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
    const { codpessoa, requisition, justification, id_status_anterior, id_status_requisicao } =
      req.body;
    const result = await RequisitionService.updateRequisitionById(
      codpessoa,
      requisition,
      justification,
      id_status_anterior,
      id_status_requisicao
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
