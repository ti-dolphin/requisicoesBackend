class PatrimonyRepository {
  static deletePatrimonyQuery() {
    return `
      DELETE FROM web_patrimonio WHERE id_patrimonio = ?
    `;
  }
  static getInactivePatrymonyInfoQuery() {
    return `
        SELECT 
            web_patrimonio.pat_legado AS patrimonio,
            web_patrimonio.id_patrimonio,
            id_responsavel,
            GERENTE.NOME AS gerente,
            PROJETOS.DESCRICAO AS projeto,
            RESPONSAVEL.NOME AS responsavel,
            web_patrimonio.nome as nome,
            web_patrimonio.DESCRICAO as descricao,
            movimentacao_patrimonio.id_movimentacao as numeroMovimentacao,
            movimentacao_patrimonio.data as dataMovimentacao
            FROM dsecombr_controle.movimentacao_patrimonio 
            inner join PROJETOS on id_projeto = PROJETOS.ID
            inner join web_patrimonio on web_patrimonio.id_patrimonio = movimentacao_patrimonio.id_patrimonio 
            AND movimentacao_patrimonio.id_movimentacao IN (SELECT max(id_movimentacao)  as id_movimentacao from movimentacao_patrimonio group by id_patrimonio)
            inner join PESSOA as GERENTE on GERENTE.CODGERENTE = PROJETOS.CODGERENTE
            inner join PESSOA as RESPONSAVEL on RESPONSAVEL.CODPESSOA = movimentacao_patrimonio.id_responsavel WHERE web_patrimonio.ativo = 0
    `;
  }

  static updatePatrimonies() {
    return `
      UPDATE web_patrimonio SET ativo = ? where id_patrimonio in ( ? )
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
            FROM web_tipo_patrimonio
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
    console.log("updatePatrimonyQuery");
    return `
        UPDATE web_patrimonio SET
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
       FROM web_patrimonio
        INNER JOIN web_tipo_patrimonio ON web_tipo_patrimonio.id_tipo_patrimonio = web_patrimonio.tipo
       WHERE id_patrimonio = ?
    `;
  }

  static getPatrimonyInfoQuery() {
    return `    
          SELECT 
          web_patrimonio.pat_legado AS patrimonio,
          web_patrimonio.id_patrimonio,
          id_responsavel,
          GERENTE.NOME AS gerente,
          PROJETOS.DESCRICAO AS projeto,
          RESPONSAVEL.NOME AS responsavel,
          web_patrimonio.nome as nome,
          web_patrimonio.descricao as descricao,
          movimentacao_patrimonio.id_movimentacao as numeroMovimentacao,
          movimentacao_patrimonio.data as dataMovimentacao,
          movimentacao_patrimonio.aceito
      FROM dsecombr_controle.movimentacao_patrimonio 
      INNER JOIN PROJETOS ON id_projeto = PROJETOS.ID
      INNER JOIN web_patrimonio ON web_patrimonio.id_patrimonio = movimentacao_patrimonio.id_patrimonio 
        AND movimentacao_patrimonio.id_movimentacao IN (
            SELECT max(id_movimentacao) as id_movimentacao 
            FROM movimentacao_patrimonio 
            GROUP BY id_patrimonio
        )
      INNER JOIN PESSOA AS GERENTE ON GERENTE.CODGERENTE = PROJETOS.CODGERENTE
      INNER JOIN PESSOA AS RESPONSAVEL ON RESPONSAVEL.CODPESSOA = movimentacao_patrimonio.id_responsavel
      WHERE web_patrimonio.ativo = 1
      ORDER BY movimentacao_patrimonio.data DESC; -- Ordena pela dataMovimentacao em ordem decrescente
        `;
  }

  static createPatrimonyQuery() {
    return `
          INSERT INTO web_patrimonio (nome, data_compra, nserie, descricao, pat_legado, tipo)
          VALUES ( ? , ?, ?, ?, ?, ?)
    `;
  }
  static createPatrimonyQueryNoPurchaseData(){ 
    return `
     INSERT INTO web_patrimonio (nome, nserie, descricao, pat_legado, tipo)
          VALUES ( ?, ?, ?, ?, ?)
    `;
  };
}
module.exports = PatrimonyRepository;
