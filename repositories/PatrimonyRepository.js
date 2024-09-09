class PatrimonyRepository {
  static deletePatrimonyQuery() {
    return `
      DELETE FROM patrimonio WHERE id_patrimonio = ?
    `;
  }
  static getInactivePatrymonyInfoQuery() {
    return `
        SELECT 
            patrimonio.pat_legado AS patrimonio,
            patrimonio.id_patrimonio,
            id_responsavel,
            GERENTE.NOME AS gerente,
            PROJETOS.DESCRICAO AS projeto,
            RESPONSAVEL.NOME AS responsavel,
            patrimonio.nome as nome,
            patrimonio.DESCRICAO as descricao,
            movimentacao_patrimonio.id_movimentacao as numeroMovimentacao,
            movimentacao_patrimonio.data as dataMovimentacao
            FROM dsecombr_controle.movimentacao_patrimonio 
            inner join PROJETOS on id_projeto = PROJETOS.ID
            inner join patrimonio on patrimonio.id_patrimonio = movimentacao_patrimonio.id_patrimonio 
            AND movimentacao_patrimonio.id_movimentacao IN (SELECT max(id_movimentacao)  as id_movimentacao from movimentacao_patrimonio group by id_patrimonio)
            inner join PESSOA as GERENTE on GERENTE.CODGERENTE = PROJETOS.CODGERENTE
            inner join PESSOA as RESPONSAVEL on RESPONSAVEL.CODPESSOA = movimentacao_patrimonio.id_responsavel WHERE patrimonio.ativo = 0
    `;
  }

  static updatePatrimonies() {
    return `
      UPDATE patrimonio SET ativo = ? where id_patrimonio in ( ? )
    `;
  }

  static getPatrimonyResponsable() {
    return `
     SELECT id_responsavel, id_movimentacao, id_patrimonio
        FROM movimentacao_patrimonio
        WHERE id_patrimonio = ?
        ORDER BY id_movimentacao DESC
        LIMIT 1;

    `;
  }

  static getPatrimonyTypeQuery() {
    return `
            SELECT id_tipo_patrimonio, nome_tipo 
            FROM tipo_patrimonio
    `;
  }
  static deletePatrimonyFileQuery() {
    return `
        DELETE FROM anexo_patrimonio WHERE id_anexo_patrimonio = ?
    `;
  }
  static createPatrimonyFileQuery() {
    return `
      INSERT INTO anexo_patrimonio (arquivo, nome_arquivo, id_patrimonio)
      VALUES ( ?, ? , ? )
    `;
  }
  static getPatrimonyFilesQuery() {
    return `
        SELECT * FROM anexo_patrimonio WHERE id_patrimonio = ?
      `;
  }

  static updatePatrimonyQuery() {
    console.log('updatePatrimonyQuery')
    return `
        UPDATE patrimonio SET
        nome = ? ,
         data_compra = ?,
          nserie = ?,
           descricao = ?,
            pat_legado = ?,
            ativo = ?
            WHERE id_patrimonio = ?

    `;
  }

  static getSinglePatrimonyInfo() {
    return `
      SELECT id_patrimonio, nome, data_compra, nserie, descricao, pat_legado, nome_tipo, ativo
       FROM patrimonio
        INNER JOIN tipo_patrimonio ON tipo_patrimonio.id_tipo_patrimonio = patrimonio.tipo
       WHERE id_patrimonio = ?
    `;
  }

  static getPatrimonyInfoQuery() {
    return `    
          SELECT 
          patrimonio.pat_legado AS patrimonio,
          patrimonio.id_patrimonio,
          id_responsavel,
          GERENTE.NOME AS gerente,
          PROJETOS.DESCRICAO AS projeto,
          RESPONSAVEL.NOME AS responsavel,
          patrimonio.nome as nome,
          patrimonio.DESCRICAO as descricao,
          movimentacao_patrimonio.id_movimentacao as numeroMovimentacao,
          movimentacao_patrimonio.data as dataMovimentacao
      FROM dsecombr_controle.movimentacao_patrimonio 
      INNER JOIN PROJETOS ON id_projeto = PROJETOS.ID
      INNER JOIN patrimonio ON patrimonio.id_patrimonio = movimentacao_patrimonio.id_patrimonio 
        AND movimentacao_patrimonio.id_movimentacao IN (
            SELECT max(id_movimentacao) as id_movimentacao 
            FROM movimentacao_patrimonio 
            GROUP BY id_patrimonio
        )
      INNER JOIN PESSOA AS GERENTE ON GERENTE.CODGERENTE = PROJETOS.CODGERENTE
      INNER JOIN PESSOA AS RESPONSAVEL ON RESPONSAVEL.CODPESSOA = movimentacao_patrimonio.id_responsavel
      WHERE patrimonio.ativo = 1
      ORDER BY movimentacao_patrimonio.data DESC; -- Ordena pela dataMovimentacao em ordem decrescente


        `;
  }

  static createPatrimonyQuery() {
    return `
          INSERT INTO patrimonio (nome, data_compra, nserie, descricao, pat_legado, tipo)
          VALUES ( ? , ?, ?, ?, ?, ?)
    `;
  }
}
module.exports = PatrimonyRepository;
