class PatrimonyRepository {
  static deletePatrimonyFileQuery(){ 
    return `
        DELETE FROM anexo_patrimonio WHERE id_anexo_patrimonio = ?
    `;
  };
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
    return `
        UPDATE patrimonio SET
        nome = ? ,
         data_compra = ?,
          nserie = ?,
           descricao = ?,
            pat_legado = ?
            WHERE id_patrimonio = ?

    `;
  }
  static getSinglePatrimonyInfo() {
    return `
      SELECT * FROM patrimonio WHERE id_patrimonio = ?
    `;
  }
  static getPatrimonyInfoQuery() {
    return `    
            SELECT 
            patrimonio.pat_legado AS patrimonio,
            patrimonio.id_patrimonio,
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
            inner join PESSOA as RESPONSAVEL on RESPONSAVEL.CODPESSOA = movimentacao_patrimonio.id_responsavel
        `;
  }
  static createPatrimonyQuery() {
    return `
          INSERT INTO patrimonio (nome, data_compra, nserie, descricao, pat_legado)
          VALUES                 ( ? , ?, ?, ?, ?)
    `;
  }
}
module.exports = PatrimonyRepository;
