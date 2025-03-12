

class OpportunityRepository {

  static getOppsByManagerQuery = () => {
    return `SELECT
    P.CODPESSOA,
    P.NOME,
    P.EMAIL,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID_PROJETO', OS.ID_PROJETO,
                    'ADICIONAL', AD.NUMERO,
                    'NOME', OS.NOME,
                    'VALORFATDOLPHIN', CONCAT('R$ ', FORMAT(OS.VALORFATDOLPHIN, 2, 'de_DE')),
                    'VALORFATDIRETO', CONCAT('R$ ', FORMAT(OS.VALORFATDIRETO, 2, 'de_DE')),
                    'VALORTOTAL', CONCAT('R$ ', FORMAT(IFNULL(OS.VALORFATDIRETO, 0) + IFNULL(OS.VALORFATDOLPHIN, 0), 2, 'de_DE'))
                )
            )
        FROM
            ORDEMSERVICO OS
            INNER JOIN PROJETOS PROJ ON PROJ.ID = OS.ID_PROJETO
            INNER JOIN ADICIONAIS AD ON OS.ID_ADICIONAL = AD.ID
        WHERE
            PROJ.CODGERENTE = P.CODGERENTE
            AND OS.CODSTATUS IN (SELECT CODSTATUS FROM STATUS WHERE ACAO = 0)
            AND OS.CODTIPOOS = 21
            AND OS.DATAINTERACAO < CURDATE()
            AND PROJ.ATIVO = 1
    ) AS expiredOpportunities,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID_PROJETO', OS.ID_PROJETO,
                    'ADICIONAL', AD.NUMERO,
                    'NOME', OS.NOME,
                    'VALORFATDOLPHIN', CONCAT('R$ ', FORMAT(OS.VALORFATDOLPHIN, 2, 'de_DE')),
                    'VALORFATDIRETO', CONCAT('R$ ', FORMAT(OS.VALORFATDIRETO, 2, 'de_DE')),
                    'VALORTOTAL',
                     CONCAT('R$ ', FORMAT(IFNULL(OS.VALORFATDIRETO, 0) + IFNULL(OS.VALORFATDOLPHIN, 0), 2, 'de_DE'))
                )
            )
        FROM
            ORDEMSERVICO OS
            INNER JOIN PROJETOS PROJ ON PROJ.ID = OS.ID_PROJETO
            INNER JOIN ADICIONAIS AD ON OS.ID_ADICIONAL = AD.ID
        WHERE
            PROJ.CODGERENTE = P.CODGERENTE
            AND OS.CODTIPOOS = 21
            AND OS.CODSTATUS IN (SELECT CODSTATUS FROM STATUS WHERE ACAO = 0)
            AND OS.DATAINTERACAO >= CURDATE()
            AND OS.DATAINTERACAO <= DATE_ADD(CURDATE(), INTERVAL 4 DAY)
            AND PROJ.ATIVO = 1
    ) AS toExpireOpportunities
FROM
    PESSOA P
WHERE
    P.CODGERENTE IS NOT NULL;`
  }

  static getOppsByComercialResponsableQuery = () => {
    return `
                SELECT
    P.CODPESSOA,
    P.NOME,
    P.EMAIL,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID_PROJETO', OS.ID_PROJETO,
                    'ADICIONAL', AD.NUMERO,
                    'NOME', OS.NOME,
                    'VALORFATDOLPHIN', CONCAT('R$ ', FORMAT(OS.VALORFATDOLPHIN, 2, 'de_DE')),
                     'VALORFATDIRETO', CONCAT('R$ ', FORMAT(OS.VALORFATDIRETO, 2, 'de_DE')),
                    'VALORTOTAL', CONCAT('R$ ', FORMAT(IFNULL(OS.VALORFATDIRETO, 0) + IFNULL(OS.VALORFATDOLPHIN, 0), 2, 'de_DE'))
                )
            )
        FROM
            ORDEMSERVICO OS
            INNER JOIN PROJETOS PROJ ON PROJ.ID = OS.ID_PROJETO
            INNER JOIN PESSOA P2 ON PROJ.CODGERENTE = P2.CODGERENTE
            INNER JOIN ADICIONAIS AD ON OS.ID_ADICIONAL = AD.ID
        WHERE
            OS.RESPONSAVEL = P.CODPESSOA
            AND CODSTATUS IN (SELECT CODSTATUS FROM STATUS WHERE ACAO = 0)
            AND OS.CODTIPOOS = 21
            AND OS.DATAINTERACAO < CURDATE()
            AND PROJ.ATIVO = 1
    ) AS expiredOpportunities,
    (
        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'ID_PROJETO', OS.ID_PROJETO,
                    'ADICIONAL', AD.NUMERO,
                    'NOME', OS.NOME,
                    'VALORFATDOLPHIN', CONCAT('R$ ', FORMAT(OS.VALORFATDOLPHIN, 2, 'de_DE')),
                     'VALORFATDIRETO', CONCAT('R$ ', FORMAT(OS.VALORFATDIRETO, 2, 'de_DE')),
                    'VALORTOTAL', CONCAT('R$ ', FORMAT(IFNULL(OS.VALORFATDIRETO, 0) + IFNULL(OS.VALORFATDOLPHIN, 0), 2, 'de_DE'))
                )
            )
        FROM
            ORDEMSERVICO OS
            INNER JOIN PROJETOS PROJ ON PROJ.ID = OS.ID_PROJETO
            INNER JOIN PESSOA P2 ON PROJ.CODGERENTE = P2.CODGERENTE
            INNER JOIN ADICIONAIS AD ON AD.ID_PROJETO = PROJ.ID
        WHERE
            OS.RESPONSAVEL = P.CODPESSOA
            AND OS.CODTIPOOS = 21
			AND CODSTATUS IN (SELECT CODSTATUS FROM STATUS WHERE ACAO = 0)
            AND OS.DATAINTERACAO >= CURDATE()
            AND OS.DATAINTERACAO <= DATE_ADD(CURDATE(), INTERVAL 4 DAY)
		    AND PROJ.ATIVO = 1

    ) AS toExpireOpportunities
FROM
    PESSOA P WHERE P.PERM_COMERCIAL = 1;
                `
  }

  static deleteOppFilesQuery = (idsToDeleteString) => {
    return `
    DELETE FROM web_anexos_os WHERE id_anexo_os in ${idsToDeleteString}`;
  };
  static getAllFollowers = () => {
    return `
      SELECT * FROM web_seguidores_projeto WHERE ativo = 1
    `;
  };
  static deleteAllfollowersByProjectId = () => {
    return `
     DELETE FROM web_seguidores_projeto WHERE id_projeto = ?
    `;
  };
  static deleteFollowersByProjectIdQuery = (currentFollowerCodpessoaList) => {
    return `
    DELETE FROM web_seguidores_projeto WHERE id_projeto = ? AND codpessoa NOT IN  (${currentFollowerCodpessoaList})`;
  };
  static createFollowerQuery = () => {
    return `
          insert into 
        web_seguidores_projeto (
          id_seguidor_projeto, 
          id_projeto, 
          codpessoa, 
          ativo
        )
      values
        (?,?,?,?);
    `;
  };
  static updateCommentQuery = () => {
    return `
      UPDATE COMENTARIOS SET
      DESCRICAO =?
      WHERE CODCOMENTARIO = ?
    `;
  };
  static insertCommentQuery = () => {
    return `
        INSERT INTO COMENTARIOS
        (CODAPONT, CODOS, DESCRICAO, RECCREATEDON, RECCREATEDBY, EMAIL)
        VALUES 
        (?, ?, ?, ?, ? ,?)
    `;
  };
  static getOppByIdQuery = () => {
    return `
                      SELECT 
              CODOS as codOs, 
              CODTIPOOS as codTipoOs, 
              CODCCUSTO as codCCusto, 
              OBRA as obra, 
              DATASOLICITACAO as dataSolicitacao, 
              DATANECESSIDADE as dataNecessidade, 
              DOCREFERENCIA as docReferencia, 
              LISTAMATERIAIS as listaMateriais, 
              DATAINICIO as dataInicio, 
              DATAPREVENTREGA as dataPrevEntrega, 
              DATAENTREGA as dataEntrega, 
              CODSTATUS as codStatus, 
              ORDEMSERVICO.NOME as nome,
              DESCRICAO as descricao, 
              ATIVIDADES as atividades, 
              PRIORIDADE as prioridade, 
              SOLICITANTE as solicitante, 
              RESPONSAVEL as responsavel, 
              CODDISCIPLINA as codDisciplina, 
              GUT as gut, 
              GRAVIDADE as gravidade, 
              URGENCIA as urgencia, 
              TENDENCIA as tendencia, 
              DATALIBERACAO as dataLiberacao, 
              RELACIONAMENTO as relacionamento, 
              FK_CODCLIENTE as fkCodCliente, 
              NOMEFANTASIA as nomeCliente,
              FK_CODCOLIGADA as fkCodColigada, 
              VALORFATDIRETO as valorFatDireto, 
              VALORSERVICOMO as valorServicoMO, 
              VALORSERVICOMATAPLICADO as valorServicoMatAplicado, 
              VALORMATERIAL as valorMaterial, 
              VALORTOTAL as valorTotal, 
              CODSEGMENTO as codSegmento, 
              CODCIDADE as codCidade, 
              VALORLOCACAO as valorLocacao, 
              ID_ADICIONAL as idAdicional, 
              ORDEMSERVICO.ID_PROJETO as idProjeto, 
              DATAINTERACAO as dataInteracao, 
              VALORFATDOLPHIN as valorFatDolphin, 
              PRINCIPAL as principal, 
              VALOR_COMISSAO as valorComissao, 
              ID_MOTIVO_PERDIDO as idMotivoPerdido, 
              OBSERVACOES as observacoes, 
              DESCRICAO_VENDA as descricaoVenda, 
              EMAIL_VENDA_ENVIADO as emailVendaEnviado,
              NUMERO as numeroAdicional,
              COALESCE(
                  (
                      SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'codigoComentario', c.CODCOMENTARIO,
                              'descricao', c.DESCRICAO,
                              'criadoEm', c.RECCREATEDON,
                              'criadoPor', c.RECCREATEDBY,
                              'email', c.EMAIL
                          )
                      )
                      FROM COMENTARIOS c
                      WHERE c.CODOS = ORDEMSERVICO.CODOS
                  ), JSON_ARRAY()
              ) AS comentarios, -- Lista de comentários em formato JSON
              COALESCE(
                  (
                      SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'id_anexo_os', a.id_anexo_os,
                              'codos', a.codos,
                              'nome_arquivo', a.nome_arquivo,
                              'arquivo', a.arquivo
                          )
                      )
                      FROM web_anexos_os a
                      WHERE a.codos = ORDEMSERVICO.CODOS
                  ), JSON_ARRAY()
              ) AS files, -- Lista de anexos em formato JSON
              COALESCE(
                  (
                      SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'id_seguidor_projeto', s.id_seguidor_projeto,
                              'id_projeto', s.id_projeto,
                              'codpessoa', s.codpessoa,
                              'ativo', s.ativo,
                              'nome', PESSOA.NOME
                          )
                      )
                      FROM web_seguidores_projeto s
                      INNER JOIN PESSOA ON PESSOA.CODPESSOA = s.codpessoa
                      WHERE s.id_projeto = ORDEMSERVICO.ID_PROJETO
                  ), JSON_ARRAY()
              ) AS seguidores -- Lista de seguidores em formato JSON
          FROM 
              ORDEMSERVICO 
          INNER JOIN 
              ADICIONAIS ON ID = ID_ADICIONAL
          INNER JOIN CLIENTE ON CLIENTE.CODCLIENTE = ORDEMSERVICO.FK_CODCLIENTE
          WHERE 
              CODOS = ?;
    `;
  };
  static getOppFilesQuery = () => {
    return `
          SELECT id_anexo_os,codos,nome_arquivo,arquivo FROM web_anexos_os where codos = ? ;
    `;
  };
  static createOppFileQuery = () => {
    return `insert into web_anexos_os (
        codos, nome_arquivo, 
        arquivo
      ) 
      values 
        (?, ?, ?);
      `;
  };
  static updateOpportunityQuery = () => {
    return `
      UPDATE ORDEMSERVICO SET 
      CODTIPOOS = ?, 
      CODCCUSTO = ?, 
      OBRA = ?, 
      DATASOLICITACAO = ?, 
      DATANECESSIDADE = ?, 
      DOCREFERENCIA = ?, 
      LISTAMATERIAIS = ?, 
      DATAINICIO = ?, 
      DATAPREVENTREGA = ?, 
      DATAENTREGA = ?, 
      CODSTATUS = ?, 
      NOME = ?, 
      DESCRICAO = ?, 
      ATIVIDADES = ?, 
      PRIORIDADE = ?, 
      SOLICITANTE = ?, 
      RESPONSAVEL = ?, 
      CODDISCIPLINA = ?, 
      GUT = ?, 
      GRAVIDADE = ?, 
      URGENCIA = ?, 
      TENDENCIA = ?, 
      DATALIBERACAO = ?, 
      RELACIONAMENTO = ?, 
      FK_CODCLIENTE = ?, 
      FK_CODCOLIGADA = ?, 
      VALORFATDIRETO = ?, 
      VALORSERVICOMO = ?, 
      VALORSERVICOMATAPLICADO = ?, 
      VALORMATERIAL = ?, 
      VALORTOTAL = ?, 
      CODSEGMENTO = ?, 
      CODCIDADE = ?, 
      VALORLOCACAO = ?, 
      ID_ADICIONAL = ?, 
      ID_PROJETO = ?, 
      DATAINTERACAO = ?, 
      VALORFATDOLPHIN = ?, 
      PRINCIPAL = ?, 
      VALOR_COMISSAO = ?, 
      id_motivo_perdido = ?, 
      observacoes = ?, 
      DESCRICAO_VENDA = ?, 
      EMAIL_VENDA_ENVIADO = ?
      WHERE CODOS = ?
    `;
  };
  static createAdicional = () => {
    return `INSERT INTO ADICIONAIS (ID_PROJETO, NUMERO)
      SELECT ?, IFNULL(MAX(NUMERO), -1) + 1
      FROM ADICIONAIS
      WHERE ID_PROJETO = ?`;
  };
  static createOpportunityQuery = () => {
    return `
            INSERT INTO ORDEMSERVICO (
            CODOS, CODTIPOOS, CODCCUSTO, OBRA, DATASOLICITACAO, DATANECESSIDADE, DOCREFERENCIA, LISTAMATERIAIS, DATAINICIO, DATAPREVENTREGA, 
            DATAENTREGA, CODSTATUS, NOME, DESCRICAO, ATIVIDADES, PRIORIDADE, SOLICITANTE, RESPONSAVEL, CODDISCIPLINA, GUT, GRAVIDADE, 
            URGENCIA, TENDENCIA, DATALIBERACAO, RELACIONAMENTO, FK_CODCLIENTE, FK_CODCOLIGADA, VALORFATDIRETO, VALORSERVICOMO, VALORSERVICOMATAPLICADO, 
            VALORMATERIAL, VALORTOTAL, CODSEGMENTO, CODCIDADE, VALORLOCACAO, ID_ADICIONAL, ID_PROJETO, DATAINTERACAO, VALORFATDOLPHIN, PRINCIPAL, 
            VALOR_COMISSAO, id_motivo_perdido, observacoes, DESCRICAO_VENDA, EMAIL_VENDA_ENVIADO
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          );
    `;
  };
  static getOppStatusListQuery = () => {
    return `
      SELECT * FROM STATUS as s where ATIVO = 1
    `;
  };
  static getOpportunitiesQuery = (dateFilters, action) => {
    let baseQuery = `
                SELECT 
                os.ID_PROJETO AS numeroProjeto, -- Número do projeto
                ad.NUMERO AS numeroAdicional, -- Número adicional
                s.NOME AS nomeStatus, -- Status do projeto
                c.NOMEFANTASIA AS nomeCliente, -- Nome do cliente
                os.NOME AS nomeDescricaoProposta, -- Descrição da proposta
                os.DATASOLICITACAO AS dataSolicitacao, -- Data do cadastro
                os.DATAENTREGA AS dataFechamento, -- Data de fechamento (venda)
                os.DATAINTERACAO AS dataInteracao, -- Data de interação
                os.DATAINICIO AS dataInicio, -- Data de início
                vendedor.NOME AS nomeVendedor, -- Nome do vendedor
                gerente.NOME AS nomeGerente, -- Nome do gerente
                CONCAT('R$ ', FORMAT(os.VALORFATDOLPHIN, 2, 'de_DE')) AS valorFaturamentoDolphin, -- Valor de faturamento Dolphin
                CONCAT('R$ ', FORMAT(os.VALORFATDIRETO, 2, 'de_DE')) AS valorFaturamentoDireto, -- Valor de faturamento direto
                CONCAT('R$ ', FORMAT((os.VALORFATDOLPHIN + os.VALORFATDIRETO), 2, 'de_DE')) AS valorTotal, -- Valor total
                os.CODOS AS numeroOs -- Número da ordem de serviço
            FROM 
                ORDEMSERVICO os
            LEFT JOIN 
                PROJETOS p ON os.ID_PROJETO = p.ID
            LEFT JOIN 
                CLIENTE c ON os.FK_CODCLIENTE = c.CODCLIENTE AND os.FK_CODCOLIGADA = c.CODCOLIGADA
            LEFT JOIN 
                PESSOA vendedor ON os.RESPONSAVEL = vendedor.CODPESSOA
            LEFT JOIN 
                PESSOA gerente ON p.CODGERENTE = gerente.CODGERENTE
            LEFT JOIN 
                STATUS s ON os.CODSTATUS = s.CODSTATUS
            LEFT JOIN
                ADICIONAIS ad ON ad.ID = os.ID_ADICIONAL
            WHERE 
                p.ATIVO = 1 AND s.ATIVO = 1  
                ${action ? "AND s.ACAO IN (1, 0) AND" : "AND s.ACAO = 0 AND"
      }
                (
                    os.ID_PROJETO IN (SELECT id_projeto FROM web_seguidores_projeto WHERE codpessoa = ?)
                    OR
                    os.ID_PROJETO IN (SELECT ID FROM PROJETOS WHERE PROJETOS.CODGERENTE IN (SELECT CODGERENTE FROM PESSOA WHERE CODPESSOA = ?))
                    OR 
                    ? IN (SELECT CODPESSOA FROM PESSOA WHERE PERM_ADMINISTRADOR = 1)
                )
            
    `;
    for (let dateFilter of dateFilters) {
      if (dateFilter.from !== "") {
        baseQuery += ` AND ${dateFilter.dbField} >= '${dateFilter.from}'`;
      }
      if (dateFilter.to !== "") {
        baseQuery += ` AND ${dateFilter.dbField} <= '${dateFilter.to}'`;
      }
    }
    baseQuery += ` ORDER BY 
                os.CODOS DESC; -- Ordenação pelo número da ordem de serviço, do maior para o menor.`
    return baseQuery;
  };
}

module.exports = OpportunityRepository;
