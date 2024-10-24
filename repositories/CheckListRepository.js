

class CheckListRepository {
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

  static getUndoneChecklistsByMovementationQuery = () => {
    return `
      SELECT * FROM web_checklist_movimentacao WHERE 
      id_movimentacao = ?
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
      id_movimentacao = ?, data_criacao = ?, realizado = ?, data_realizado = ?, aprovado = ?, data_aprovado = ?, observacao = ?
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

  static getChecklistItemFilesQuery() {
    return `
        SELECT * FROM web_items_checklist_movimentacao
        WHERE id_checklist_movimentacao = ? 
    `;
  }

  static getChecklistItemsQuery() {
    return `
    SELECT * FROM web_patrimonio
    INNER JOIN web_items_checklist_tipo ON
    web_items_checklist_tipo.id_tipo_patrimonio = web_patrimonio.tipo
    WHERE web_patrimonio.id_patrimonio = ?
    `;
  }

  static getChecklistByPatrimonyIdQuery() {
    return `
    SELECT 
      id_checklist_movimentacao, 
      web_checklist_movimentacao.id_movimentacao, 
      data_criacao, 
      realizado, 
      data_realizado, 
      aprovado, 
      data_aprovado, 
      web_checklist_movimentacao.observacao, 
      web_patrimonio.nome, 
      web_patrimonio.id_patrimonio,
      web_tipo_patrimonio.responsavel_tipo,
      movimentacao_patrimonio.id_responsavel as responsavel_movimentacao
     FROM web_checklist_movimentacao
    INNER JOIN  movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao =  web_checklist_movimentacao.id_movimentacao
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
  data_criacao, 
  realizado, 
  data_realizado, 
  aprovado, 
  data_aprovado, 
  web_checklist_movimentacao.observacao, 
  web_patrimonio.nome, 
  web_patrimonio.id_patrimonio,
  web_tipo_patrimonio.responsavel_tipo,
  movimentacao_patrimonio.id_responsavel as responsavel_movimentacao
FROM 
  web_checklist_movimentacao 
  INNER JOIN movimentacao_patrimonio ON movimentacao_patrimonio.id_movimentacao = web_checklist_movimentacao.id_movimentacao 
  INNER JOIN web_patrimonio ON movimentacao_patrimonio.id_patrimonio = web_patrimonio.id_patrimonio 
  INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo 
WHERE 
  web_checklist_movimentacao.realizado = 0 
  OR web_checklist_movimentacao.aprovado = 0 
  AND (movimentacao_patrimonio.id_responsavel = ? 
  OR web_tipo_patrimonio.responsavel_tipo = ?)`;
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
    mp.observacao
FROM 
    movimentacao_patrimonio AS mp
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
    AND wcm.id_movimentacao = max_checklist.id_movimentacao;

        
    `;
  };

  static getUndoneChecklists = () => {
    return `
        SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
        data_criacao, 
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
        web_checklist_movimentacao.realizado = 0 
    `;
  };

  static getUnaprovedChecklists = () => {
    return `
      SELECT 
        id_checklist_movimentacao, 
        web_checklist_movimentacao.id_movimentacao, 
        data_criacao, 
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