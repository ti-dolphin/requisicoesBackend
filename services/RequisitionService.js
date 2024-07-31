
const { json } = require("express");
const pool = require("../database");
const userController = require('../controllers/userController');

class RequisitionService {

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
    console.log("purchaser");
    let query, params;
    if (currentKanbanFilter.toUpperCase() === "A FAZER") {
      console.log("usuario comprador e filtro a fazer");
      query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? ";
      params = ["Requisitado"];
    } else if (currentKanbanFilter.toUpperCase() === "FAZENDO") {
      console.log("usuario comprador e filtro a fazendo");
      query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? OR STATUS = ?";
      params = ["Em cotação", "Cotado"];
    } else if (currentKanbanFilter.toUpperCase() === "CONCLUÍDO") {
      console.log("usuario comprador e filtro a concluído");
      query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ?";
      params = ["Concluído"];
    } else if (currentKanbanFilter.toUpperCase() === "TUDO") {
      console.log("usuário comprador e filtro tudo");
      query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID ";
      params = [];
    }
    return { query, params };
  }

  static async defineNonPurchaserQuery(userID, currentKanbanFilter) {
    let query, params;
    if (currentKanbanFilter.toUpperCase() === "BACKLOG") {
      console.log("nonPurchaser gerente");
      query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? " +
        "AND ID_RESPONSAVEL = ?";
      params = ["Em edição", userID];
    } else if (currentKanbanFilter.toUpperCase() === "ACOMPANHAMENTO") {
      const gerente = await userController.isManager(userID);
      if (gerente) {
        console.log("acompanhamento e gerente");
        query =
          "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
          "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
          "WHERE STATUS != ? AND CODGERENTE = ?";
        const codgerente = await userController.getManagerCode(userID);
        console.log("codgerente: ", codgerente);
        params = ["Em edição", codgerente];
      } else {
        console.log("acompanhamento e usuário não gerente");
        query =
          "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
          "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
          "WHERE STATUS != ? AND ID_RESPONSAVEL = ?";
        params = ["Em edição", userID];
      }
    } else if (currentKanbanFilter.toUpperCase() === "TUDO") {
      console.log("não comprador e filtro tudo");
      query = "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID ";
      params = [];
    }
    return { query, params };
  }

  static async getRequisitionByID(id) {
    const query = `SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO inner join PROJETOS on ID_PROJETO = PROJETOS.ID WHERE ID_REQUISICAO = ?`;
    try {
      const [rows] = await this.executeQuery(query, [id]);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async insertRequisitions(json) {
    const nowDateTime = new Date();
    const opcoes = {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const nowDateTimeInBrazil = nowDateTime
      .toLocaleString("sv-SE", opcoes)
      .replace("T", " ");
    const items = json.map(
        (item) =>
          `('${item.STATUS}','${item.DESCRIPTION}', ${item.ID_PROJETO}, ${item.ID_RESPONSAVEL}, '${nowDateTimeInBrazil}')`
      )
      .join(", ");

    const query =
      "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, CREATED_ON ) VALUES " +
      items;
    try {
      const resultSetHeader = await this.executeQuery(query, []);
      return resultSetHeader;
    } catch (err) {
      return null;
    }
  }

  static async updateRequisitionById(requisition, id) {
    try {
      const query = await this.setQueryUpdate(requisition, id);
      const result = await this.executeQuery(query);
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
  }

  static async setQueryUpdate(requisition) {
    const nowDateTime = new Date();
    const opcoes = {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const nowDateTimeInBrazil = nowDateTime
      .toLocaleString("sv-SE", opcoes)
      .replace("T", " ");
    return `UPDATE WEB_REQUISICAO
       SET DESCRIPTION = '${requisition.DESCRIPTION}',
           STATUS = '${requisition.STATUS}',
           LAST_UPDATE_ON = '${nowDateTimeInBrazil}',
           OBSERVACAO = '${requisition.OBSERVACAO}'
       WHERE ID_REQUISICAO = ${requisition.ID_REQUISICAO}`;
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
      console.log("result executeQuery ReqService - ", result);
      return result;
    } catch (queryError) {
      console.log("queryError: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}
module.exports = RequisitionService;