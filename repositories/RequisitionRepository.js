class RequisitionRepository {
    
   static getById(){ 
        return `SELECT ID_REQUISICAO, STATUS, OBSERVACAO, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, LAST_UPDATE_ON, CREATED_ON, DESCRICAO from WEB_REQUISICAO inner join PROJETOS on ID_PROJETO = PROJETOS.ID WHERE ID_REQUISICAO = ?`;
   } 
    
  static getManagerRequisitions_monitoring() {
    return `SELECT ID_REQUISICAO,
                            STATUS,
                            OBSERVACAO,
                            DESCRIPTION,
                            ID_PROJETO,
                            ID_RESPONSAVEL,
                            LAST_UPDATE_ON,
                            CREATED_ON,
                            DESCRICAO,
                            NOME
                        FROM   WEB_REQUISICAO
                            INNER JOIN PROJETOS
                                    ON ID_PROJETO = PROJETOS.ID
                            INNER JOIN PESSOA
                                    ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                        WHERE   STATUS != ?
                                AND (PROJETOS.CODGERENTE = ?  OR ID_RESPONSAVEL = ?)
                               
`;
  }

  static getNonPurchaser_monitoring() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO,
                 NOME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID    
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
          WHERE STATUS != ? AND ID_RESPONSAVEL = ?`;
  }

  static getNonPurchaser_all() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO,
                 NOME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL`;
  }

  static getPurchaser_toDo() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO,
                 NOME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                WHERE STATUS = ?`;
  }

  static getPurchaser_doing() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
          WHERE  STATUS = ?
                 OR STATUS = ?`;
  }

  static getPurchaser_done() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
          WHERE  STATUS = ?`;
  }

  static getPurchaser_all() {
    return `SELECT ID_REQUISICAO,
                 STATUS,
                 OBSERVACAO,
                 DESCRIPTION,
                 ID_PROJETO,
                 ID_RESPONSAVEL,
                 LAST_UPDATE_ON,
                 CREATED_ON,
                 DESCRICAO,
                 NOME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL`;
  }

  static getNonPurchaser_backlog() {
    return `SELECT ID_REQUISICAO,
                            STATUS,
                            OBSERVACAO,
                            DESCRIPTION,
                            ID_PROJETO,
                            ID_RESPONSAVEL,
                            LAST_UPDATE_ON,
                            CREATED_ON,
                            DESCRICAO,
                            NOME
                        FROM   WEB_REQUISICAO
                            INNER JOIN PROJETOS
                                    ON ID_PROJETO = PROJETOS.ID
                            INNER JOIN PESSOA
                                    ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                        WHERE  STATUS = ?
                            AND ID_RESPONSAVEL = ?`;
  }

  static insertRequisition(json) {
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
    const items = json
      .map(
        (item) =>
          `('${item.STATUS}','${item.DESCRIPTION}', ${item.ID_PROJETO}, ${item.ID_RESPONSAVEL}, '${nowDateTimeInBrazil}')`
      )
      .join(", ");
    return (
      "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, CREATED_ON ) VALUES " +
      items
    );
  }

  static async update(requisition) {
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
}
module.exports = RequisitionRepository;
