
class CheckListRepository {

  static finishChecklistByPatrimonyId = ( )=> { 
     return `
            UPDATE web_checklist_movimentacao WCM
      SET WCM.realizado = 1,
          WCM.aprovado = 1
      WHERE WCM.id_checklist_movimentacao = (
          SELECT id
          FROM (
              SELECT MAX(id_checklist_movimentacao) as id
              FROM web_checklist_movimentacao WCM2
              INNER JOIN movimentacao_patrimonio MP ON MP.id_movimentacao = WCM2.id_movimentacao
              WHERE MP.id_patrimonio = ? AND WCM2.realizado = 0
          ) AS temp
      );
     `
  }

  static getNonRealizedByPatrimonyId = ( ) => { 
    return `
          SELECT MAX(id_checklist_movimentacao) as id  FROM  web_checklist_movimentacao WCM
          INNER JOIN movimentacao_patrimonio MP ON MP.id_movimentacao = WCM.id_movimentacao
          WHERE MP.id_patrimonio = ? AND WCM.realizado = 0;

    `
  }

  static getLateUndoneChecklists = () => {
    return `
        SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
        web_checklist_movimentacao.data_criacao, 
        realizado, 
        data_realizado, 
        aprovado, 
        data_aprovado, 
        web_checklist_movimentacao.observacao, 
        web_patrimonio.nome, 
        web_patrimonio.id_patrimonio,
        web_tipo_patrimonio.responsavel_tipo,
        movimentacao_patrimonio.id_responsavel as responsavel_movimentacao,
        PESSOA.NOME as nome_responsavel_movimentacao,
        PESSOA.EMAIL as email_responsavel_movimentacao,
        web_patrimonio.nome as nome_patrimonio,
         PESSOA_RESPONSAVEL_TIPO.EMAIL as email_responsavel_tipo
      FROM 
        web_checklist_movimentacao 
        INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
        INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
        INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
        INNER JOIN PESSOA on PESSOA.CODPESSOA = movimentacao_patrimonio.id_responsavel
        INNER JOIN PESSOA as PESSOA_RESPONSAVEL_TIPO on  web_tipo_patrimonio.responsavel_tipo = PESSOA_RESPONSAVEL_TIPO.CODPESSOA
      WHERE 
        web_checklist_movimentacao.realizado = 0 and  web_checklist_movimentacao.data_criacao < DATE_SUB(CURDATE(), INTERVAL 3 DAY);
    `;
  };

  static getProblematicItemsQuery = () => {
    return `
      SELECT * FROM web_items_checklist_movimentacao WHERE problema = 1 and id_checklist_movimentacao = ?
    `;
  };

  static getUnaprovedChecklistByIdQuery() {
    return `
    SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
         web_checklist_movimentacao.data_criacao, 
        realizado, 
        data_realizado, 
        aprovado, 
        data_aprovado, 
        web_checklist_movimentacao.observacao, 
        web_patrimonio.nome, 
        web_patrimonio.id_patrimonio,
        web_tipo_patrimonio.responsavel_tipo,
        movimentacao_patrimonio.id_responsavel as responsavel_movimentacao,
        PESSOA.NOME as nome_responsavel_movimentacao,
        PESSOA.EMAIL as email_responsavel_movimentacao,
        web_patrimonio.nome as nome_patrimonio,
         PESSOA_RESPONSAVEL_TIPO.EMAIL as email_responsavel_tipo
      FROM 
        web_checklist_movimentacao 
        INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
        INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
        INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
        INNER JOIN PESSOA on PESSOA.CODPESSOA = movimentacao_patrimonio.id_responsavel
        INNER JOIN PESSOA as PESSOA_RESPONSAVEL_TIPO on  web_tipo_patrimonio.responsavel_tipo = PESSOA_RESPONSAVEL_TIPO.CODPESSOA
      WHERE 
        web_checklist_movimentacao.realizado = 0 and reprovado = 1 and id_checklist_movimentacao = ?`;
  }

  static createChecklistItemsQuery = (insertID) => {
    console.log("createChecklistItemsQuery");
    return `
     INSERT INTO web_items_checklist_movimentacao (id_checklist_movimentacao, nome_item_checklist) 
    SELECT ${insertID}, ict.nome_item_checklist 
    FROM web_checklist_movimentacao
    INNER JOIN movimentacao_patrimonio AS mp ON mp.id_movimentacao = web_checklist_movimentacao.id_movimentacao
    INNER JOIN web_patrimonio AS p ON p.id_patrimonio = mp.id_patrimonio
    INNER JOIN web_items_checklist_tipo AS ict ON ict.id_tipo_patrimonio = p.tipo
    WHERE web_checklist_movimentacao.id_checklist_movimentacao = ${insertID};
    `;
  };

  static createCheckListItemFileQuery = () => {
    return `
      INSERT INTO web_items_checklist_movimentacao (id_checklist_movimentacao, nome_item_checklist, arquivo, problema, valido, observacao )
      VALUES (?,?,?,?,?, ?)
    `;
  };

  static updateCheckListItemfileQuery = () => {
    return `
      UPDATE  web_items_checklist_movimentacao
      SET  arquivo = ?
      WHERE id_item_checklist_movimentacao = ? 
    `;
  };

  static getUndoneChecklistsByPatrimony = () => {
    return `
      SELECT * FROM web_checklist_movimentacao
      INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao
      WHERE 
      id_patrimonio = ? AND web_checklist_movimentacao.realizado = 0
    `;
  };

  static updateChecklistQuery = () => {
    return `
      INSERT INTO web_checklist_movimentacao(id_movimentacao, data_criacao, realizado, data_realizado, aprovado, data_aprovado, observacao)
      VALUES (?, ?, ?, ?, ?, ?, ? )
    `;
  };

  static updatedChecklistQuery = () => {
    return `
      UPDATE web_checklist_movimentacao SET 
      id_movimentacao = ?, data_criacao = ?, realizado = ?, data_realizado = ?, aprovado = ?, data_aprovado = ?, observacao = ?, reprovado = ?
      WHERE id_checklist_movimentacao = ?
    `;
  };

  static getInsertChecklistItemsQuery(items) {
    const params = items.map((item) => [
      item.id_checklist_movimentacao,
      item.nome_item_checklist,
      item.arquivo,
      item.problema,
    ]);

    // Generate a query with multiple placeholders for each set of params
    const placeholders = items.map(() => "(?, ?, ?, ?)").join(", ");

    const query = `
      INSERT INTO web_items_checklist_movimentacao 
      (id_checklist_movimentacao, nome_item_checklist, arquivo, problema) 
      VALUES ${placeholders};
    `;

    return { query, params: params.flat() }; // Flatten the params array
  }

  static getUpdateChecklistItemsQuery(items) {
    const query = `
      UPDATE web_items_checklist_movimentacao 
      SET problema = ?, arquivo = ?, observacao = ?
      WHERE id_item_checklist_movimentacao = ?;
    `;

    const paramsArray = items.map((item) => [
      query,
      [
        item.problema,
        item.arquivo,
        item.observacao,
        item.id_item_checklist_movimentacao,
      ],
    ]);

    return { query, paramsArray };
  }

  static getChecklistItemsQuery() {
    return `
        SELECT id_item_checklist_movimentacao, id_checklist_movimentacao, nome_item_checklist, arquivo, problema, observacao
        FROM web_items_checklist_movimentacao
        WHERE id_checklist_movimentacao = ? 
    `;
  }

  static getChecklistByPatrimonyIdQuery() {
    console.log("getChecklistByPatrimonyIdQuery");
    return `
    SELECT 
      id_checklist_movimentacao, 
      web_checklist_movimentacao.id_movimentacao, 
       web_checklist_movimentacao.data_criacao, 
      realizado, 
      data_realizado, 
      aprovado, 
      data_aprovado, 
      web_checklist_movimentacao.observacao, 
      web_patrimonio.nome, 
      web_patrimonio.id_patrimonio,
      web_tipo_patrimonio.responsavel_tipo,
      movimentacao_patrimonio.id_responsavel as responsavel_movimentacao,
      PESSOA.NOME as nome_responsavel,
      PESSOA.CODPESSOA as responsavel_movimentacao,
      PROJETOS.DESCRICAO as descricao_projeto,
      web_patrimonio.nome as nome_patrimonio
     FROM web_checklist_movimentacao
      INNER JOIN  movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao =  web_checklist_movimentacao.id_movimentacao
      INNER JOIN PESSOA ON movimentacao_patrimonio.id_responsavel = PESSOA.CODPESSOA
      INNER JOIN PROJETOS ON movimentacao_patrimonio.id_projeto = PROJETOS.ID
      INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
      INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
      WHERE web_patrimonio.id_patrimonio = ?
  `;
  }

  static getChecklistNotificationsQuery() {
    return `    
            SELECT 
    id_checklist_movimentacao, 
    web_checklist_movimentacao.id_movimentacao, 
     web_checklist_movimentacao.data_criacao, 
    realizado, 
    data_realizado, 
    aprovado, 
    data_aprovado, 
    web_checklist_movimentacao.observacao, 
    web_patrimonio.nome, 
    web_patrimonio.id_patrimonio,
    web_tipo_patrimonio.responsavel_tipo,
    movimentacao_patrimonio.id_responsavel AS responsavel_movimentacao,
    PESSOA.NOME AS nome_responsavel,
    PESSOA.CODPESSOA AS responsavel_movimentacao,
    PROJETOS.DESCRICAO AS descricao_projeto,
    web_patrimonio.nome AS nome_patrimonio,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM web_items_checklist_movimentacao 
            WHERE web_items_checklist_movimentacao.id_checklist_movimentacao = web_checklist_movimentacao.id_checklist_movimentacao
              AND web_items_checklist_movimentacao.problema = 1
        ) THEN 1 
        ELSE 0 
    END AS problema
FROM 
    web_checklist_movimentacao 
    INNER JOIN movimentacao_patrimonio 
        ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
    INNER JOIN PESSOA 
        ON movimentacao_patrimonio.id_responsavel = PESSOA.CODPESSOA
    INNER JOIN PROJETOS 
        ON movimentacao_patrimonio.id_projeto = PROJETOS.ID
    INNER JOIN web_patrimonio 
        ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
    INNER JOIN web_tipo_patrimonio 
        ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
WHERE 
    (web_checklist_movimentacao.realizado = 0 
     OR web_checklist_movimentacao.aprovado = 0)
    AND (movimentacao_patrimonio.id_responsavel = ? 
         OR web_tipo_patrimonio.responsavel_tipo = ?);
`;
  }

  static getLastChecklistPerMovementationQuery = () => {
    return `
    SELECT
    wcm.id_checklist_movimentacao,
    mp.id_movimentacao,
    wcm.data_criacao,
    wcm.realizado,
    wcm.data_realizado,
    wcm.aprovado,
    wcm.data_aprovado,
    mp.observacao,
    periodicidade
FROM
    movimentacao_patrimonio AS mp
INNER JOIN web_patrimonio AS wp ON mp.id_patrimonio = wp.id_patrimonio
INNER JOIN web_tipo_patrimonio AS wtp ON wtp.id_tipo_patrimonio = wp.tipo
INNER JOIN web_checklist_movimentacao AS wcm
    ON wcm.id_movimentacao = mp.id_movimentacao
INNER JOIN (
    SELECT
        id_movimentacao,
        MAX(id_checklist_movimentacao) AS max_id_checklist_movimentacao
    FROM
        web_checklist_movimentacao
    GROUP BY
        id_movimentacao
) AS max_checklist
    ON wcm.id_checklist_movimentacao = max_checklist.max_id_checklist_movimentacao
    AND wcm.id_movimentacao = max_checklist.id_movimentacao
INNER JOIN (
    SELECT
        id_patrimonio,
        MAX(id_movimentacao) AS max_id_movimentacao
    FROM
        movimentacao_patrimonio
    GROUP BY
        id_patrimonio
) AS max_movimentacao
    ON mp.id_patrimonio = max_movimentacao.id_patrimonio
    AND mp.id_movimentacao = max_movimentacao.max_id_movimentacao;
        SELECT
        wcm.id_checklist_movimentacao,
        mp.id_movimentacao,
        wcm.data_criacao,
        wcm.realizado,
        wcm.data_realizado,
        wcm.aprovado,
        wcm.data_aprovado,
        mp.observacao,
        periodicidade
    FROM
        movimentacao_patrimonio AS mp
    INNER JOIN web_patrimonio AS wp ON mp.id_patrimonio = wp.id_patrimonio
    INNER JOIN web_tipo_patrimonio AS wtp ON wtp.id_tipo_patrimonio = wp.tipo
    INNER JOIN web_checklist_movimentacao AS wcm
        ON wcm.id_movimentacao = mp.id_movimentacao
    INNER JOIN (
        SELECT
            id_movimentacao,
            MAX(id_checklist_movimentacao) AS max_id_checklist_movimentacao
        FROM
            web_checklist_movimentacao
        GROUP BY
            id_movimentacao
    ) AS max_checklist
        ON wcm.id_checklist_movimentacao = max_checklist.max_id_checklist_movimentacao
        AND wcm.id_movimentacao = max_checklist.id_movimentacao
    INNER JOIN (
        SELECT
            id_patrimonio,
            MAX(id_movimentacao) AS max_id_movimentacao
        FROM
            movimentacao_patrimonio
        GROUP BY
            id_patrimonio
    ) AS max_movimentacao
        ON mp.id_patrimonio = max_movimentacao.id_patrimonio
        AND mp.id_movimentacao = max_movimentacao.max_id_movimentacao;

    where wp.ativo = 1
    `;
  };

  static getUndoneChecklists = () => {
    return `
        SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
         web_checklist_movimentacao.data_criacao, 
        realizado, 
        data_realizado, 
        aprovado, 
        data_aprovado, 
        web_checklist_movimentacao.observacao, 
        web_patrimonio.nome, 
        web_patrimonio.id_patrimonio,
        web_tipo_patrimonio.responsavel_tipo,
        movimentacao_patrimonio.id_responsavel as responsavel_movimentacao,
        PESSOA.NOME as nome_responsavel_movimentacao,
        PESSOA.EMAIL as email_responsavel_movimentacao,
        web_patrimonio.nome as nome_patrimonio
      FROM 
        web_checklist_movimentacao 
        INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
        INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
        INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
        INNER JOIN PESSOA on PESSOA.CODPESSOA = movimentacao_patrimonio.id_responsavel
      WHERE 
        web_checklist_movimentacao.realizado = 0 AND web_patrimonio.ativo = 1
    `;
  };

  static getUnaprovedChecklists = () => {
    return `
      SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
         web_checklist_movimentacao.data_criacao, 
        realizado, 
        data_realizado, 
        aprovado, 
        data_aprovado, 
        web_checklist_movimentacao.observacao, 
        web_patrimonio.nome, 
        web_patrimonio.id_patrimonio,
        web_tipo_patrimonio.responsavel_tipo,
        movimentacao_patrimonio.id_responsavel as responsavel_movimentacao,
        PESSOA.NOME as nome_responsavel_tipo,
         PESSOA.EMAIL as email_responsavel_tipo
      FROM 
        web_checklist_movimentacao 
        INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
        INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
        INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
        INNER JOIN PESSOA on PESSOA.CODPESSOA =  web_tipo_patrimonio.responsavel_tipo
      WHERE 
        web_checklist_movimentacao.realizado = 1
        AND web_checklist_movimentacao.aprovado = 0 
        AND web_patrimonio.ativo = 1
    `;
  };

  static createChecklistQuery = () => {
    return `
      INSERT INTO web_checklist_movimentacao 
      (id_movimentacao, data_criacao, realizado, data_realizado, aprovado, data_aprovado, observacao)
      VALUES (?, NOW(), 0, NULL, 0, NULL, '')
    `;
  };
};

module.exports = CheckListRepository;