const { json } = require("express");
const pool = require("../database");
const userController = require("../controllers/userController");
const RequisitionRepository = require("../repositories/RequisitionRepository");
class RequisitionService {


  static async getTypes(){ 
    const types = await this.executeQuery(
      RequisitionRepository.getTypesQuery()
    );
    return types;
  }
  
  static async getRequisitions(userID, currentKanbanFilter) {
    const { query, params } = await this.setKanbanQuery(
      userID,
      currentKanbanFilter
    );
    try {
      const rows = await this.executeQuery(query, params);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async setKanbanQuery(userID, currentKanbanFilter) {
    const purchaser = await userController.isPurchaser(userID);
    if (purchaser) {
      return await this.definePurchaser(userID, currentKanbanFilter);
    }
    return await this.defineNonPurchaserQuery(userID, currentKanbanFilter);
  }

  static async definePurchaser(userID, currentKanbanFilter) {
    let query, params;
    if (currentKanbanFilter.toUpperCase() === "A FAZER") {
      query = RequisitionRepository.getPurchaser_toDo();
      params = ["Requisitado"];
    } else if (currentKanbanFilter.toUpperCase() === "FAZENDO") {
      query = RequisitionRepository.getPurchaser_doing();
      params = ["Em cotação", "Cotado"];
    } else if (currentKanbanFilter.toUpperCase() === "CONCLUÍDO") {
      query = RequisitionRepository.getPurchaser_done();
      params = ["Concluído"];
    } else if (currentKanbanFilter.toUpperCase() === "TUDO") {
      query = RequisitionRepository.getPurchaser_all();
      params = [];
    }
    return { query, params };
  }

  static async defineNonPurchaserQuery(userID, currentKanbanFilter) {
    let query, params;
    if (currentKanbanFilter.toUpperCase() === "BACKLOG") {
      query = RequisitionRepository.getNonPurchaser_backlog();
      params = ["Em edição", userID];
    } else if (currentKanbanFilter.toUpperCase() === "ACOMPANHAMENTO") {
      const gerente = await userController.isManager(userID);
      if (gerente) {
        console.log('gerente')
        query = RequisitionRepository.getManagerRequisitions_monitoring();
        const codgerente = await userController.getManagerCode(userID);
        params = ["Em edição", "Concluído", codgerente, userID];
      } else {
         console.log("not gerente");
        query = RequisitionRepository.getNonPurchaser_monitoring();
        params = ["Em edição", "Concluído", userID];
      }
    } else if (currentKanbanFilter.toUpperCase() === "TUDO") {
      query = RequisitionRepository.getNonPurchaser_all();
      params = [];
    }
    return { query, params };
  }

  static async getRequisitionByID(id) {
    const query = RequisitionRepository.getById();
    try {
      const [rows] = await this.executeQuery(query, [id]);
      console.log('rows: ', rows);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async insertRequisitions(json) {
    try {
      console.log(json)
      const query = RequisitionRepository.insertRequisition(json);
      const resultSetHeader = await this.executeQuery(query, []);
      return resultSetHeader;
    } catch (err) {
      return null;
    }
  }

  static async updateRequisitionById(codpessoa, requisition) {
    try {
      const query = await RequisitionRepository.update(codpessoa, requisition);
      const result = await this.executeQuery(query);
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
