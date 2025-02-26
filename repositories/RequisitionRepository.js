class RequisitionRepository {
  static getById() {
    return `SELECT 
  ID_REQUISICAO, 
  STATUS, 
  OBSERVACAO, 
  DESCRIPTION, 
  ID_PROJETO, 
  ID_RESPONSAVEL, 
  LAST_UPDATE_ON, 
  CREATED_ON, 
  DESCRICAO,
  TIPO, 
  nome_tipo,
  PESSOA.NOME as NOME_RESPONSAVEL,
  JSON_OBJECT('label', PESSOA.NOME, 'id', PESSOA.CODPESSOA) AS responsableOption,
  JSON_OBJECT('label', PROJETOS.DESCRICAO, 'id', PROJETOS.ID) AS projectOption,
  JSON_OBJECT('label', nome_tipo, 'id', TIPO) AS typeOption,
   (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', web_tipo_requisicao.nome_tipo, 'id',web_tipo_requisicao.id_tipo_requisicao ))
    FROM web_tipo_requisicao
  ) AS typeOptions,
   (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', p.DESCRICAO, 'id', p.ID)) 
   FROM PROJETOS p 
   WHERE p.ATIVO = 1
  ) AS projectOptions,
  (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', PESSOA.NOME, 'id', PESSOA.CODPESSOA))
  FROM PESSOA WHERE PERM_REQUISITAR = 1) AS responsableOptions
from 
  WEB_REQUISICAO 
  inner join PROJETOS on ID_PROJETO = PROJETOS.ID 
  inner join web_tipo_requisicao on id_tipo_requisicao = TIPO
  inner join PESSOA on WEB_REQUISICAO.ID_RESPONSAVEL = PESSOA.CODPESSOA
WHERE 
  ID_REQUISICAO = ?
`;
  }
  static getTypesQuery() {
    return `
        SELECT id_tipo_requisicao, nome_tipo from web_tipo_requisicao;
        `;
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
                             PESSOA.NOME AS NOME_RESPONSAVEL,
                             PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
                        FROM   WEB_REQUISICAO
                            INNER JOIN PROJETOS
                                    ON ID_PROJETO = PROJETOS.ID
                            INNER JOIN PESSOA
                                    ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                            INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY
                        WHERE   STATUS != ? AND STATUS != ?
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
                PESSOA.NOME AS NOME_RESPONSAVEL,
                PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID    
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                 INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY
          WHERE STATUS != ? AND STATUS != ? AND ID_RESPONSAVEL = ?`;
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
                PESSOA.NOME AS NOME_RESPONSAVEL,
                 PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY `;
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
                  PESSOA.NOME AS NOME_RESPONSAVEL,
                 PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                  INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY
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
                 DESCRICAO,
                  PESSOA.NOME AS NOME_RESPONSAVEL,
                 PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                  INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY
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
                 DESCRICAO,
                 PESSOA.NOME AS NOME_RESPONSAVEL,
                 PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                  INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY
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
                 PESSOA.NOME AS NOME_RESPONSAVEL,
                 PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
          FROM   WEB_REQUISICAO
                 INNER JOIN PROJETOS
                         ON ID_PROJETO = PROJETOS.ID
                 INNER JOIN PESSOA
                         ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                  INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY`;
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
                            PESSOA.NOME AS NOME_RESPONSAVEL,
                            PESSOA2.NOME AS LAST_MODIFIED_BY_NAME
                        FROM   WEB_REQUISICAO
                            INNER JOIN PROJETOS
                                    ON ID_PROJETO = PROJETOS.ID
                            INNER JOIN PESSOA
                                    ON PESSOA.CODPESSOA = ID_RESPONSAVEL
                            INNER JOIN PESSOA AS PESSOA2
                                    ON PESSOA2.CODPESSOA = LAST_MODIFIED_BY 
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
          `('${item.STATUS}',
          '${item.DESCRIPTION}',
             ${item.ID_PROJETO},
              ${item.ID_RESPONSAVEL},
               '${nowDateTimeInBrazil}',
                '${nowDateTimeInBrazil}',
                   ${item.ID_RESPONSAVEL},
                   ${item.TIPO})`
      )
      .join(", ");
    return (
      "INSERT INTO WEB_REQUISICAO (STATUS, DESCRIPTION, ID_PROJETO, ID_RESPONSAVEL, CREATED_ON, LAST_UPDATE_ON, LAST_MODIFIED_BY, TIPO) VALUES " +
      items
    );
  }

  static async update(codpessoa, requisition) {
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
           SET
           DESCRIPTION = '${requisition.DESCRIPTION}',
           STATUS = '${requisition.STATUS}',
           ID_PROJETO = ${requisition.ID_PROJETO},
           ID_RESPONSAVEL = ${requisition.ID_RESPONSAVEL},
           TIPO = ${requisition.TIPO},
           LAST_UPDATE_ON = '${nowDateTimeInBrazil}',
           LAST_MODIFIED_BY = ${codpessoa},
           OBSERVACAO = '${requisition.OBSERVACAO}'
       WHERE ID_REQUISICAO = ${requisition.ID_REQUISICAO}`;
  }
}
module.exports = RequisitionRepository;
