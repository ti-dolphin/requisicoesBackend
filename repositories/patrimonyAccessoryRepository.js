class PatrimonyAccessoryRepository {
  static createAccessoryQuery() {
    return `
      INSERT INTO acessorio_patrimonio (nome, id_patrimonio, descricao)
      VALUES (?, ?, ?)
    `;
  }

  static getAccessoryByIdQuery() {
    return `
      SELECT id_acessorio_patrimonio, nome, id_patrimonio
      FROM acessorio_patrimonio
      WHERE id_acessorio_patrimonio = ?
    `;
  }

  static updateAccessoryQuery() {
    return `
      UPDATE acessorio_patrimonio
      SET nome = ?, id_patrimonio = ?
      WHERE id_acessorio_patrimonio = ?
    `;
  }

  static deleteAccessoryQuery() {
    return `
      DELETE FROM acessorio_patrimonio
      WHERE id_acessorio_patrimonio = ?
    `;
  }

  static getAccessoriesByPatrimonyIdQuery() {
    return `
      SELECT id_acessorio_patrimonio, nome, id_patrimonio
      FROM acessorio_patrimonio
      WHERE id_patrimonio = ?
    `;
  }

  static getFilesByAccessoryIdQuery() {
    return `
      SELECT id_anexo_acessorio_patrimonio, nome, arquivo
      FROM anexo_acessorio_patrimonio
      WHERE id_acessorio_patrimonio = ?
    `;
  }

  static deletPatrimonyAccessoryFileQuery() {
    return `
      DELETE FROM anexo_acessorio_patrimonio
      WHERE id_anexo_acessorio_patrimonio = ?
    `;
  }
  static createPatrimonyAccessoryFileQuery() {
    return `
      INSERT INTO anexo_acessorio_patrimonio (arquivo, nome, id_acessorio_patrimonio)
      VALUES (?, ?, ?)
    `;
  }
}

module.exports = PatrimonyAccessoryRepository;
