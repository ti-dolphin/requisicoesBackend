const { json } = require("express");
const pool = require("../database");
const { executeQuery } = require("./requisitionItemController");
const { options } = require("../routes/requisitionRouter");

const requisitonController = {
  getRequisitions: async () => {
    const query =
      "SELECT ID_REQUISICAO, STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO inner join PROJETOS on ID_PROJETO = PROJETOS.ID";
    try {
      const [rows, fields] = await requisitonController.executeQuery(query);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  getRequisitionByID: async (id) => {
    const query = `SELECT ID_REQUISICAO, STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO inner join PROJETOS on ID_PROJETO = PROJETOS.ID WHERE ID_REQUISICAO = ?`;

    try {
      const [rows, fields] = await requisitonController.executeQuery(query, [
        id
      ]);
      console.log(rows);
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  insertRequisitions: async (json) => {
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
    );

    const query =
      "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, CREATED_ON ) VALUES " +
      items;
    try {
      const [resultSetHeader, rows] = await requisitonController.executeQuery(
        query
      );
      return resultSetHeader;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  updateRequisitonById: async (requisition, id) => {
    try {
      const query = await requisitonController.setQueryUpdate(requisition, id);
      const result = await requisitonController.executeQuery(query);
      return result;
    } catch (err) {
      console.log("erro no execute / setquery: ", err);
      return null;
    }
  },

  setQueryUpdate: async (requisition, id) => {
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

    return `UPDATE WEB_REQUISICAO SET DESCRIPTION = '${requisition.DESCRIPTION}', STATUS = '${requisition.STATUS}', LAST_UPDATE_ON = '${nowDateTimeInBrazil}' where ID_REQUISICAO = ${id}`;
  },

  deleteRequisitionById: async (requisitionID) => {
    const query =
      "DELETE from WEB_REQUISICAO WHERE ID_REQUISICAO = " + requisitionID;
    try {
      const result = await requisitonController.executeQuery(query);
      return result;
    } catch (err) {
      console.log("err: ", err);
      return null;
    }
  },

  executeQuery: async (query, params) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query, params);
      (await connection).release();
      return result;
    } catch (queryError) {
      console
        .log(
          "queryErro: ",
          queryError
        )(await connection)
        .release();
      throw queryError;
    }
  },
};

module.exports = requisitonController;
