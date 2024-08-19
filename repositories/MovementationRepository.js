

class MovementationRepository {
  static createMovementationQuery() {
    return `
            INSERT INTO movimentacao_patrimonio 
            (data, id_patrimonio, id_projeto, id_responsavel, observacao, id_ultima_movimentacao )
            VALUES (?, ?, ? , ? , ?, ?)
        `;
  }

  static deleteMovementationFileQuery() {
    return `
      DELETE FROM anexo_movimentacao WHERE id_anexo_movimentacao = ?
    `;
  }
  static deleteMovementationQuery(){
    return `DELETE FROM movimentacao_patrimonio WHERE id_movimentacao = ?`
  };
  static updateMovementationQuery() {
    // id_movimentacao, data, id_patrimonio, id_projeto, id_responsavel, id_ultima_movimentacao, observacao ]
    return `
        UPDATE movimentacao_patrimonio
         SET
         data =  DATE_FORMAT(?, '%Y-%m-%d'),
         id_patrimonio = ?,
         id_projeto = ?,
         id_responsavel = ?,
         id_ultima_movimentacao = ?,
         observacao = ?
         WHERE id_movimentacao = ?
    `;
  }
  static getMovementationsByPatrimonyId_Query() {
    return `
          SELECT 
          id_movimentacao, 
          data, 
          id_patrimonio, 
          id_projeto, 
          id_responsavel,
          id_ultima_movimentacao,
          NOME as responsavel,
          PROJETOS.DESCRICAO as projeto,
          observacao 
        from 
          movimentacao_patrimonio 
          INNER JOIN PESSOA ON PESSOA.CODPESSOA = movimentacao_patrimonio.id_responsavel 
          INNER JOIN PROJETOS ON PROJETOS.ID = movimentacao_patrimonio.id_projeto
        WHERE 
          id_patrimonio = ?
    `;
  }

  static getLastMovementationQuery(patrimonyId) {
    return `
    SELECT id_movimentacao 
        FROM movimentacao_patrimonio 
        WHERE id_patrimonio = ${patrimonyId}
        ORDER BY data DESC 
        LIMIT 1;
    `;
  }

  static getMovementationFilesQuery() {
    return `  
        SELECT * FROM anexo_movimentacao WHERE id_movimentacao = ?
    `;
  }

  static createMovementationFileQuery() {
    return `
      INSERT INTO anexo_movimentacao (arquivo, nome_arquivo, id_movimentacao)
      values (?, ? , ?)
    `;
  }
}
module.exports = MovementationRepository;