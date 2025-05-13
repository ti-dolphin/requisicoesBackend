class RequisitionRepository {
  static getKanbans() {
    return `
      SELECT * FROM web_kanban_requisicao
    `;
  }

  static getPreviousStatus() {
    return `
      SELECT 
      JSON_OBJECT( 
      'id_status_requisicao', S.id_status_requisicao,
      'nome', S.nome,
      'acao_posterior', S.acao_posterior,
      'etapa', S.etapa,
      'acao_anterior', S.acao_anterior
      ) AS status
      FROM 
        web_alteracao_req_status alteracao
      INNER JOIN 
        web_status_requisicao S ON S.id_status_requisicao = alteracao.id_status_anterior
      WHERE 
        id_requisicao = ? 
      ORDER BY 
        data_alteracao DESC 
      LIMIT 1
    `;
  }

  static getStatusChangesByRequisition() {
    return `
      SELECT 
      A.id_alteracao,
      A.id_requisicao,
      A.id_status_requisicao,
      JSON_OBJECT( 
      'id_status_requisicao', S.id_status_requisicao,
      'nome', S.nome,
      'acao_posterior', S.acao_posterior,
      'etapa', S.etapa,
      'acao_anterior', S.acao_anterior
      ) AS status,
      JSON_OBJECT(
        'id_status_requisicao', SA.id_status_requisicao,
        'nome', SA.nome,
        'acao_posterior', SA.acao_posterior,
        'etapa', SA.etapa,
        'acao_anterior', SA.acao_anterior
      ) AS status_anterior,
      A.alterado_por,
      A.justificativa,
      JSON_OBJECT(
        'NOME', P.NOME,
        'CODPESSOA', P.CODPESSOA
      ) AS alterado_por_pessoa,
      A.data_alteracao
      FROM web_alteracao_req_status A
      INNER JOIN web_status_requisicao S ON S.id_status_requisicao = A.id_status_requisicao
      LEFT JOIN PESSOA P ON P.CODPESSOA = A.alterado_por
      LEFT JOIN web_status_requisicao SA ON SA.id_status_requisicao = A.id_status_anterior
      WHERE A.id_requisicao = ?
      ORDER BY A.data_alteracao DESC
    `;
  }

  static insertStatusChange = () => {
    return `
      INSERT INTO web_alteracao_req_status (
        id_requisicao,
        id_status_requisicao,
        id_status_anterior,
        alterado_por,
        justificativa,
        data_alteracao
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `;
  };
  static getStatusListQuery = `
    SELECT * FROM dsecombr_controle.web_status_requisicao ORDER BY etapa;
  `;

  static getById() {
    return `SELECT 
      R.ID_REQUISICAO,
      R.DESCRIPTION,
      R.ID_PROJETO,
      R.ID_RESPONSAVEL,
      R.OBSERVACAO,
      R.TIPO,
      R.criado_por,
      R.alterado_por,
      R.data_alteracao,
      R.data_criacao,
      R.id_status_requisicao,
      S.nome AS status_nome,
      JSON_OBJECT(
        'id_status_requisicao', S.id_status_requisicao,
        'nome', S.nome,
        'acao_posterior', S.acao_posterior,
        'etapa', S.etapa,
        'acao_anterior', S.acao_anterior
      ) AS status,
      JSON_OBJECT(
        'NOME', P1.NOME,
        'CODPESSOA', P1.CODPESSOA
      ) AS responsavel_pessoa,
      JSON_OBJECT(
        'NOME', P2.NOME,
        'CODPESSOA', P2.CODPESSOA
      ) AS alterado_por_pessoa,
      JSON_OBJECT(
        'ID_PROJETO', PR.ID,
        'DESCRICAO', PR.DESCRICAO,
        'gerente', JSON_OBJECT(
          'NOME', P3.NOME,
          'CODPESSOA', P3.CODPESSOA
        ),
        'responsavel', JSON_OBJECT(
          'NOME', P4.NOME,
          'CODPESSOA', P4.CODPESSOA
        )
      ) AS projeto_gerente,
      SON_OBJECT(
        'ID_PROJETO', PR.ID,
        'DESCRICAO', PR.DESCRICAO,
        'responsavel', JSON_OBJECT(
          'NOME', P4.NOME,
          'CODPESSOA', P4.CODPESSOA
        )
      ) AS projeto_responsavel,
        JSON_OBJECT(
        'ID_PROJETO', PR.ID,
        'DESCRICAO', PR.DESCRICAO
      ) AS projeto_descricao,
      JSON_OBJECT('label', P1.NOME, 'id', P1.CODPESSOA) AS responsableOption,
      JSON_OBJECT('label', PR.DESCRICAO, 'id', PR.ID) AS projectOption,
      JSON_OBJECT('label', T.nome_tipo, 'id', T.id_tipo_requisicao) AS typeOption,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', web_tipo_requisicao.nome_tipo, 'id', web_tipo_requisicao.id_tipo_requisicao))
       FROM web_tipo_requisicao) AS typeOptions,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', p.DESCRICAO, 'id', p.ID))
       FROM PROJETOS p
       WHERE p.ATIVO = 1) AS projectOptions,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('label', PESSOA.NOME, 'id', PESSOA.CODPESSOA))
       FROM PESSOA WHERE PERM_REQUISITAR = 1) AS responsableOptions
    FROM WEB_REQUISICAO R
    INNER JOIN web_status_requisicao S ON S.id_status_requisicao = R.id_status_requisicao
    INNER JOIN PESSOA P1 ON P1.CODPESSOA = R.ID_RESPONSAVEL
    LEFT JOIN PESSOA P2 ON P2.CODPESSOA = R.alterado_por
    INNER JOIN PROJETOS PR ON PR.ID = R.ID_PROJETO
    LEFT JOIN PESSOA P3 ON P3.CODGERENTE = PR.CODGERENTE
    LEFT JOIN PESSOA P4 ON P4.CODPESSOA = PR.ID_RESPONSAVEL
    INNER JOIN web_tipo_requisicao T ON T.id_tipo_requisicao = R.TIPO
    WHERE R.ID_REQUISICAO = ?`;
  }

  static getTypesQuery() {
    return `
      SELECT id_tipo_requisicao, nome_tipo FROM web_tipo_requisicao;
    `;
  }

  static insertRequisition(requisition) {
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

    // Usa os valores do objeto ou valores padrão se não fornecidos
    const id_status_requisicao = requisition.id_status_requisicao || 1; // Default para "Em edição" (ajuste conforme necessário)
    const description = requisition.DESCRIPTION || "";
    const id_projeto = requisition.ID_PROJETO || null;
    const id_responsavel = requisition.ID_RESPONSAVEL || null;
    const observacao =
      requisition.OBSERVACAO !== undefined
        ? `'${requisition.OBSERVACAO}'`
        : "NULL";
    const tipo = requisition.TIPO || null;
    const criado_por = requisition.criado_por || null;
    const alterado_por = requisition.alterado_por || null;
    const data_criacao = requisition.data_criacao
      ? `'${requisition.data_criacao.replace("T", " ").substring(0, 19)}'`
      : `'${nowDateTimeInBrazil}'`;
    const data_alteracao = requisition.data_alteracao
      ? `'${requisition.data_alteracao.replace("T", " ").substring(0, 19)}'`
      : `'${nowDateTimeInBrazil}'`;

    return `
    INSERT INTO WEB_REQUISICAO (
      id_status_requisicao,
      DESCRIPTION,
      ID_PROJETO,
      ID_RESPONSAVEL,
      OBSERVACAO,
      TIPO,
      criado_por,
      alterado_por,
      data_criacao,
      data_alteracao
    ) VALUES (
      ${id_status_requisicao},
      '${description}',
      ${id_projeto},
      ${id_responsavel},
      ${observacao},
      ${tipo},
      ${criado_por},
      ${alterado_por},
      ${data_criacao},
      ${data_alteracao}
    )
  `;
  }

  static getStatusInKanbanQuery(kanbanId) {
    return `SELECT id_status_requisicao 
            FROM web_kanban_status_requisicao 
            WHERE id_kanban_requisicao = ${kanbanId}`;
  }
  /**
   * Obtém requisições filtradas por kanban com base nas permissões do usuário
   * @param {Object} user - Dados do usuário logado
   * @param {Object} kanban - Dados do kanban selecionado
   * @returns {string} Query SQL completa
   */
  static getFilteredRequisitions(user, kanban) {
    const userPermissions = this.normalizeUserPermissions(user);
    const kanbanType = this.determineKanbanType(kanban.id_kanban_requisicao);
    const statusQuery = this.getStatusInKanbanQuery(
      kanban.id_kanban_requisicao
    );

    const whereCondition = this.buildWhereCondition({
      kanbanType,
      userPermissions,
      statusQuery,
    });

    return this.buildCompleteQuery(whereCondition, statusQuery);
  }

  /**
   * Define o tipo de kanban com constantes semânticas
   */
  static determineKanbanType(kanbanId) {
    const id = Number(kanbanId);
    return {
      isAll: id === 5,
      isConcluded: id === 4,
      isAcompanhamento: id === 3,
      isDefault: ![3, 4, 5].includes(id),
    };
  }

  /**
   * Normaliza e tipifica as permissões do usuário
   */
  static normalizeUserPermissions(user) {
    return {
      userId: Number(user.CODPESSOA || 0),
      managerId: Number(user.CODGERENTE || 0),
      isBuyer: Boolean(Number(user.PERM_COMPRADOR || 0)),
      isDirector: Boolean(Number(user.PERM_DIRETOR || 0)),
    };
  }

  /**
   * Constrói a condição WHERE de forma dinâmica
   */
  static buildWhereCondition({ kanbanType, userPermissions, statusQuery }) {
    const { userId, managerId, isBuyer, isDirector } = userPermissions;

    if (kanbanType.isAll) {
      console.log('all')
      return "1=1"; // Retorna todos os registros
    }

    if (kanbanType.isConcluded) {
      return "S.id_status_requisicao = 9"; // Status 9 = Concluído
    }

    if (kanbanType.isAcompanhamento) {
      console.log("acompanhamento")
      return `
          CASE
              WHEN S.id_status_requisicao = 2 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                isDirector
              )}
              WHEN S.id_status_requisicao = 10 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                isDirector
              )}
              WHEN S.id_status_requisicao = 3 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                isDirector
              )}
              WHEN S.id_status_requisicao = 6 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                isDirector
              )}
              WHEN S.id_status_requisicao = 7 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                false
              )}
              WHEN S.id_status_requisicao = 8 THEN ${this.buildResponsibleCondition(
                userId,
                managerId,
                isDirector
              )}
              ELSE 1=0
          END
      `;
    }
    return `
      CASE
          WHEN S.id_status_requisicao = 1 THEN R.ID_RESPONSAVEL = ${userId}
          WHEN S.id_status_requisicao IN (2, 3, 8) THEN ${Number(isBuyer)}
          WHEN S.id_status_requisicao = 10 THEN PR.ID_RESPONSAVEL = ${userId} 
          WHEN S.id_status_requisicao = 6 THEN PR.CODGERENTE = ${managerId}
          WHEN S.id_status_requisicao = 7 THEN ${Number(isDirector)}
          ELSE 1=0
      END
  `;
  }

  /**
   * Helper para construir condições de responsabilidade
   */
  static buildResponsibleCondition(userId, managerId, includeDirector) {
    const conditions = [
      `R.ID_RESPONSAVEL = ${userId}`,
      `PR.CODGERENTE = ${managerId}`,
      `PR.ID_RESPONSAVEL = ${userId}`,
    ];

    if (includeDirector) {
      conditions.push("1=1"); // Permite se for diretor
    }

    return conditions.join(" OR ");
  }

  /**
   * Monta a query completa com joins e seleção de campos
   */
  static buildCompleteQuery(whereCondition, statusQuery) {
    return `
      SELECT 
          R.ID_REQUISICAO, R.DESCRIPTION, R.ID_PROJETO, R.ID_RESPONSAVEL,
          R.OBSERVACAO, R.TIPO, R.criado_por, R.alterado_por,
          R.data_alteracao, R.data_criacao, R.id_status_requisicao,
          
          JSON_OBJECT(
              'id_status_requisicao', S.id_status_requisicao,
              'nome', S.nome,
              'acao_posterior', S.acao_posterior,
              'etapa', S.etapa,
              'acao_anterior', S.acao_anterior
          ) AS status,
          
          JSON_OBJECT(
              'NOME', P1.NOME,
              'CODPESSOA', P1.CODPESSOA
          ) AS responsavel_pessoa,
          
          JSON_OBJECT(
              'NOME', P2.NOME,
              'CODPESSOA', P2.CODPESSOA
          ) AS alterado_por_pessoa,
          
          JSON_OBJECT(
              'ID_PROJETO', PR.ID,
              'DESCRICAO', PR.DESCRICAO,
              'gerente', JSON_OBJECT(
                  'NOME', P3.NOME,
                  'CODPESSOA', P3.CODPESSOA
              ), 
              'responsavel', JSON_OBJECT(
                  'NOME', P4.NOME,
                  'CODPESSOA', P4.CODPESSOA)
            
          ) AS projeto_gerente,
           JSON_OBJECT(
              'ID_PROJETO', PR.ID,
              'DESCRICAO', PR.DESCRICAO,
              'responsavel', JSON_OBJECT(
                  'NOME', P4.NOME,
                  'CODPESSOA', P4.CODPESSOA)
          ) AS projeto_responsavel,
          JSON_OBJECT(
              'ID_PROJETO', PR.ID,
              'DESCRICAO', PR.DESCRICAO
          ) AS projeto_descricao
          
      FROM WEB_REQUISICAO R
      INNER JOIN PROJETOS PR ON PR.ID = R.ID_PROJETO
      INNER JOIN PESSOA P1 ON P1.CODPESSOA = R.ID_RESPONSAVEL
      LEFT JOIN PESSOA P2 ON P2.CODPESSOA = R.alterado_por
      LEFT JOIN PESSOA P3 ON P3.CODGERENTE = PR.CODGERENTE
      LEFT JOIN PESSOA P4 ON P4.CODPESSOA = PR.ID_RESPONSAVEL
      INNER JOIN web_status_requisicao S ON S.id_status_requisicao = R.id_status_requisicao
      WHERE 
          R.id_status_requisicao IN (${statusQuery})
          AND ${whereCondition}
  `;
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
              id_status_requisicao = ${requisition.id_status_requisicao},
              ID_PROJETO = ${requisition.ID_PROJETO},
              ID_RESPONSAVEL = ${requisition.ID_RESPONSAVEL},
              TIPO = ${requisition.TIPO},
              alterado_por = '${codpessoa}',
              data_alteracao = '${nowDateTimeInBrazil}',
              OBSERVACAO = '${requisition.OBSERVACAO}'
          WHERE ID_REQUISICAO = ${requisition.ID_REQUISICAO}`;
  }
}

module.exports = RequisitionRepository;
