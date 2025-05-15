const { json } = require("express");
const pool = require("../database");
const userController = require("../controllers/userController");
const RequisitionRepository = require("../repositories/RequisitionRepository");
const utiils = require('../utils');
class RequisitionService {
  static getRequisitionKanban = async () => {
    const data = await this.executeQuery(RequisitionRepository.getKanbans());
    return data;
  };

  static getPermissionsToNextStatus = async (requisitionID, nextStatus) => {
    //
  };

  static getPreviousStatus = async (requisitionID) => {
    const [data] = await this.executeQuery(
      RequisitionRepository.getPreviousStatus(),
      [requisitionID]
    );
    if (data) {
      return data.status;
    }
    return null;
  };

  
  static getStatusAction = async (user, requisition) => {
    const query = RequisitionRepository.getStatusAction(
      requisition,
      user
    );
    
    const [acao] = await this.executeQuery(query);
    return acao;
  };


  static async getRequisitionByID(id, user) {
    const query = RequisitionRepository.getById(id, user);
    const previousStatus = await this.getPreviousStatus(id);

    try {
      const [requisition] = await this.executeQuery(query, [id]);
      if (previousStatus) {
        return {
          ...requisition,
          status_anterior: previousStatus,
        };
      }
      return requisition;
    } catch (err) {
      throw err;
    }
  }

  

  static async getStatusChangesByRequisition(requisitionID) {
    try {
      const query = RequisitionRepository.getStatusChangesByRequisition();
      const statusChanges = await this.executeQuery(query, [requisitionID]);
      return statusChanges;
    } catch (err) {
      console.log("Error fetching status changes: ", err);
      throw err;
    }
  }

  static async getStatusList() {
    try {
      const list = await this.executeQuery(
        RequisitionRepository.getStatusListQuery
      );
      return list;
    } catch (e) {
      console.log("erro ao buscar status: ", e.message);
      throw e;
    }
  }

  static async getTypes() {
    const types = await this.executeQuery(
      RequisitionRepository.getTypesQuery()
    );
    return types;
  }

  static async getRequisitions(user, kanban, subFilter) {
  
    try {
      let rows = await this.executeQuery(
        RequisitionRepository.getFilteredRequisitions(user, kanban, subFilter)
      );

      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async insertRequisitions(body) {
    try {
      console.log(body);
      const query = RequisitionRepository.insertRequisition(body);
      const resultSetHeader = await this.executeQuery(query, []);
      return resultSetHeader;
    } catch (err) {
      throw err;
    }
  }

  static async updateRequisitionById(
    codpessoa,
    requisition,
    justification,
    id_status_anterior,
    id_status_requisicao
  ) {
    try {
      const reqBeforeUpdate = await this.getRequisitionByID(
        requisition.ID_REQUISICAO
      );
      const query = await RequisitionRepository.update(
        codpessoa,
        requisition,
        id_status_requisicao
      );
      const result = await this.executeQuery(query);
      const reqAfterUpdate = await this.getRequisitionByID(
        requisition.ID_REQUISICAO
      );
      const statusChanged =
        reqBeforeUpdate.id_status_requisicao !==
        reqAfterUpdate.id_status_requisicao;
      if (statusChanged) {
        await this.executeQuery(RequisitionRepository.insertStatusChange(), [
          requisition.ID_REQUISICAO,
          requisition.id_status_requisicao,
          id_status_anterior,
          codpessoa,
          justification,
          utiils.getCurrentDateTime(),
        ]);
      }
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
  }

  static async deleteRequisitionById(requisitionID) {
    const query =
      "DELETE from WEB_REQUISICAO WHERE ID_REQUISICAO = " + requisitionID;
    try {
      const result = await this.executeQuery(query);
      return result;
    } catch (err) {
      console.log("err: ", err);
      return null;
    }
  }

  static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("queryError: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}

module.exports = RequisitionService;
