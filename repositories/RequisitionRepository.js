class RequisitionRepository {

  static getStatusChangesByRequisition() {
    return `
      SELECT 
      A.id_alteracao,
      A.id_requisicao,
      A.id_status_requisicao,
      S.nome AS status_nome,
      A.alterado_por,
      JSON_OBJECT(
        'NOME', P.NOME,
        'CODPESSOA', P.CODPESSOA
      ) AS alterado_por_pessoa,
      A.data_alteracao
      FROM web_alteracao_req_status A
      INNER JOIN web_status_requisicao S ON S.id_status_requisicao = A.id_status_requisicao
      LEFT JOIN PESSOA P ON P.CODPESSOA = A.alterado_por
      WHERE A.id_requisicao = ?
      ORDER BY A.data_alteracao DESC
    `;
  }

  static insertStatusChange = ( ) => { 
    return `
      INSERT INTO web_alteracao_req_status (
        id_requisicao,
        id_status_requisicao,
        alterado_por,
        data_alteracao
      ) VALUES (
        ?,
        ?,
        ?,
        ?
      )
    `
  };
  static getStatusListQuery = `
    SELECT * FROM dsecombr_controle.web_status_requisicao
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
        )
      ) AS projeto_gerente,
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
    INNER JOIN web_tipo_requisicao T ON T.id_tipo_requisicao = R.TIPO
    WHERE R.ID_REQUISICAO = ?`;
  }

  static getTypesQuery() {
    return `
      SELECT id_tipo_requisicao, nome_tipo FROM web_tipo_requisicao;
    `;
  }

  static getAll() {
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
        )
      ) AS projeto_gerente,
        JSON_OBJECT(
        'ID_PROJETO', PR.ID,
        'DESCRICAO', PR.DESCRICAO
      ) AS projeto_descricao
    FROM WEB_REQUISICAO R
    INNER JOIN PROJETOS PR ON PR.ID = R.ID_PROJETO
    INNER JOIN PESSOA P1 ON P1.CODPESSOA = R.ID_RESPONSAVEL
    LEFT JOIN PESSOA P2 ON P2.CODPESSOA = R.alterado_por
    LEFT JOIN PESSOA P3 ON P3.CODGERENTE = PR.CODGERENTE
    INNER JOIN web_status_requisicao S ON S.id_status_requisicao = R.id_status_requisicao`;
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
