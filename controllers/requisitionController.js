const { json } = require("express");
const pool = require("../database");
const userController = require("./userController");

const requisitonController = {
  getRequisitions: async (req) => {
    const { userID, search, currentKanbanFilter } = req.query;
    const { query, params } = await requisitonController.setKanbanQuery(
      userID,
      currentKanbanFilter
    );
    console.log("query: ", query);
    console.log("params: ", params);
    try {
      const [rows, fields] = await requisitonController.executeQuery(
        query,
        params
      );
      return rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  setKanbanQuery: async (userID, currentKanbanFilter) => {
    //Backlog e não gerente/gerente => buscar as em edição e com respoonsável = userID
    const purchaser = await userController.isPurchaser(userID);
    if (!purchaser) {
      return await requisitonController.defineNonPurchaserQuery(
        userID,
        currentKanbanFilter
      );
    }
    return await requisitonController.definePurchaser(
      userID,
      currentKanbanFilter
    );
    //se TUDO buscar todas as requisições
  },

  definePurchaser: async (userID, currentKanbanFilter) => {
    console.log("purchaser");
    if (currentKanbanFilter.toUpperCase() === "A FAZER") {
      console.log("usuario comprador e filtro a fazer");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? ";
      console.log({ query, params: ["Requisitado"] });
      return { query, params: ["Requisitado"] };
    }
    if (currentKanbanFilter.toUpperCase() === "FAZENDO") {
      console.log("usuario comprador e filtro a fazendo");

      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? OR STATUS = ?";
      return { query, params: ["Em cotação", "Cotado"] };
    }
    if (currentKanbanFilter.toUpperCase() === "CONCLUÍDO") {
      console.log("usuario comprador e filtro a concluído");

      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ?";
      return { query, params: ["Concluído"] };
    }
    if (currentKanbanFilter.toUpperCase() === "TUDO") {
      console.log("usuário comprador e filtro tudo");
      console.log("tudo");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID ";
      return { query: query };
    }
  },

  defineNonPurchaserQuery: async (userID, currentKanbanFilter) => {
    if (currentKanbanFilter.toUpperCase() === "BACKLOG") {
      console.log("nonPurchaser gerente");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS = ? " +
        "AND ID_RESPONSAVEL = ?";
      return { query, params: ["Em edição", userID] };
    }
    //Acompanhamento e gerente => buscar todas as que não estão em edição + ele fez + usuário do  projeto em que ele é gerente fez
    const gerente = await userController.isManager(userID);
    if (currentKanbanFilter.toUpperCase() === "ACOMPANHAMENTO" && gerente) {
      console.log("acompanhamento e gerente");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS != ? AND CODGERENTE = ?";
      const codgerente = await userController.getManagerCode(userID);
      console.log('codgerente: ', codgerente)
      return { query, params: ["Em edição", codgerente] };
    }
    //Acompanhamento e não gerente => buscar todas as que não estão em edição e o usuário é o responsável
    if (currentKanbanFilter.toUpperCase() === "ACOMPANHAMENTO" && !gerente) {
      console.log("acompanhamento e usuáro não gerente");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID " +
        "WHERE STATUS != ? AND ID_RESPONSAVEL = ?";
      return { query, params: ["Em edição", userID] };
    }
     if (currentKanbanFilter.toUpperCase() === "TUDO") {
      console.log("usuário comprador e filtro tudo");
      console.log("tudo");
      const query =
        "SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO " +
        "inner join PROJETOS on ID_PROJETO = PROJETOS.ID ";
      return { query: query };
     }
  },

  getRequisitionByID: async (id) => {
    const query = `SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO inner join PROJETOS on ID_PROJETO = PROJETOS.ID WHERE ID_REQUISICAO = ?`;

    try {
      const [rows, fields] = await requisitonController.executeQuery(query, [
        id,
      ]);
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

    return `UPDATE WEB_REQUISICAO
       SET DESCRIPTION = '${requisition.DESCRIPTION}',
        STATUS = '${requisition.STATUS}',
         LAST_UPDATE_ON = '${nowDateTimeInBrazil}',
           OBSERVACAO = '${requisition.OBSERVACAO}'
            where ID_REQUISICAO = ${id}`;
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
