class OpportunityRepository {
  static createAdicional = ( ) =>  {
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

  static getOpportunitiesQuery = (dateFilters) => {
    let baseQuery = `
                  SELECT 
              os.ID_PROJETO AS numeroProjeto, -- Número do projeto
              os.ID_ADICIONAL AS numeroAdicional, -- Número adicional
              s.NOME AS nomeStatus, -- Status do projeto
              c.NOME AS nomeCliente, -- Nome do cliente
              os.NOME AS nomeDescricaoProposta, -- Descrição da proposta
              os.DATASOLICITACAO AS dataSolicitacao, -- Data do cadastro
              os.DATAENTREGA AS dataFechamento, -- Data de fechamento (venda)
              os.DATAINTERACAO AS dataInteracao, -- Data de interação
              os.DATAINICIO AS dataInicio, -- Data de início
              vendedor.NOME AS nomeVendedor, -- Nome do vendedor
              gerente.NOME AS nomeGerente, -- Nome do gerente
              CONCAT('R$ ', FORMAT(os.VALORFATDOLPHIN, 2, 'de_DE')) AS valorFaturamentoDolphin, -- Valor de faturamento Dolphin
              CONCAT('R$ ', FORMAT(os.VALORFATDIRETO, 2, 'de_DE')) AS valorFaturamentoDireto, -- Valor de faturamento direto
              CONCAT('R$ ', FORMAT(os.VALORTOTAL, 2, 'de_DE')) AS valorTotal, -- Valor total
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
              PESSOA gerente ON p.CODGERENTE = gerente.CODPESSOA
          LEFT JOIN 
              STATUS s ON os.CODSTATUS = s.CODSTATUS
          WHERE 
              p.ATIVO = 1 AND s.ATIVO = 1 AND s.ACAO = ?;

    `;
    for (let dateFilter of dateFilters) {
      if (dateFilter.from !== "") {
        baseQuery += ` AND ${dateFilter.dbField} >= '${dateFilter.from}'`;
      }
      if (dateFilter.to !== "") {
        baseQuery += ` AND ${dateFilter.dbField} <= '${dateFilter.to}'`;
      }
    }
    return baseQuery;
  };
}
module.exports = OpportunityRepository;
