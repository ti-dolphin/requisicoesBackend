

class MovementationRepository {

  static acceptMovementationQuery() {
    return `
      UPDATE movimentacao_patrimonio SET aceito = 1 WHERE id_movimentacao = ?
     `;
  }

  static setLastMovementationIdQuery() {
    return `UPDATE movimentacao_patrimonio set id_ultima_movimentacao = ? WHERE id_movimentacao = ?`;
  }

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

  static deleteMovementationQuery() {
    return `DELETE FROM movimentacao_patrimonio WHERE id_movimentacao = ?`;
  }

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
    console.log("getMovementationsByPatrimonyId_Query");
    return `
         SELECT 
            movimentacao_patrimonio.id_movimentacao, 
            movimentacao_patrimonio.data, 
            movimentacao_patrimonio.id_patrimonio, 
            movimentacao_patrimonio.id_projeto, 
            movimentacao_patrimonio.id_responsavel,
            movimentacao_patrimonio.id_ultima_movimentacao,
            PESSOA.NOME as responsavel,
            PROJETOS.DESCRICAO as projeto,
            movimentacao_patrimonio.observacao,
            movimentacao_patrimonio2.id_responsavel as id_ultimo_responsavel,
            movimentacao_patrimonio.aceito
        FROM 
            movimentacao_patrimonio 
            INNER JOIN PESSOA ON PESSOA.CODPESSOA = movimentacao_patrimonio.id_responsavel 
            INNER JOIN PROJETOS ON PROJETOS.ID = movimentacao_patrimonio.id_projeto
            INNER JOIN movimentacao_patrimonio AS movimentacao_patrimonio2 ON movimentacao_patrimonio2.id_movimentacao = movimentacao_patrimonio.id_ultima_movimentacao
        WHERE 
            movimentacao_patrimonio.id_patrimonio = ?
        ORDER BY 
            movimentacao_patrimonio.data DESC;  -- Ordena pela data da movimentação, mais recente primeiro

    `;
  }

  static getLastMovementationQuery(patrimonyId) {
    return `
    SELECT id_movimentacao, id_responsavel
        FROM movimentacao_patrimonio 
        WHERE id_patrimonio = ${patrimonyId}
        ORDER BY data DESC 
        LIMIT 2;
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