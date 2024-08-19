const PatrimonyRepository = require("../repositories/PatrimonyRepository");
const pool = require("../database");
const fireBaseService = require("./fireBaseService");
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

class PatrimonyService {
  static async deletePatrimonyFile(patrimonyFileId) {
    const result = await this.executeQuery(
      PatrimonyRepository.deletePatrimonyFileQuery(),
      [patrimonyFileId]
    );
    return result.affectedRows;
  }

  static async createPatrimonyFile(patrimonyId, file) {
    const { path, filename } = file;
    const fileUrl = await this.getFileUrl(path, filename);

    const result = await this.executeQuery(
      PatrimonyRepository.createPatrimonyFileQuery(),
      [fileUrl, filename, patrimonyId]
    );
    return result.insertId;
  }
  static async getFileUrl(path, filename) {
    await fireBaseService.uploadFileToFireBase(path);
    const [allFiles] = await fireBaseService.getFilesFromFirebase();
    const createdFile = allFiles.find((item) => item.name === filename);
    return createdFile.publicUrl();
  }

  static async getPatrimonyFiles(patrimonyId) {
    const result = await this.executeQuery(
      PatrimonyRepository.getPatrimonyFilesQuery(),
      [patrimonyId]
    );
    return result;
  }

  static async getSinglePatrimonyInfo(patrimonyId) {
    const result = await this.executeQuery(
      PatrimonyRepository.getSinglePatrimonyInfo(),
      [patrimonyId]
    );
    return result;
  }

  static async updatePatrimony(patrimony) {
    const { id_patrimonio, nome, data_compra, nserie, descricao, pat_legado } =
      patrimony;
    const result = await this.executeQuery(
      PatrimonyRepository.updatePatrimonyQuery(),
      [
        nome,
        new Date(data_compra)
          .toLocaleDateString("sv-SE", opcoes)
          .replace("T", " ")
          .replace(/ .*/, ""),
        nserie,
        descricao,
        pat_legado,
        id_patrimonio,
      ]
    );
    return result.affectedRows;
  }

  static async getPatrimonyInfo() {
    try {
      const rows = await this.executeQuery(
        PatrimonyRepository.getPatrimonyInfoQuery()
      );
      if (rows) return rows;
    } catch (e) {
      console.log("error in PatrimonyService.getPatrimonyInfo: \n", e);
      return null;
    }
  }

  static async createPatrimony(newPatrimony) {
    const {
      nome,
      data_compra, // This should be in ISO date string format, e.g., "2024-08-09"
      nserie,
      descricao,
      pat_legado,
    } = newPatrimony;
    console.log({
      nome,
      data_compra, // This should be in ISO date string format, e.g., "2024-08-09"
      nserie,
      descricao,
      pat_legado,
    });

  
    const purchaseDate = new Date(data_compra)
      .toLocaleDateString("sv-SE", opcoes)
      .replace("T", " ")
      .replace(/ .*/, "");
    try {
      //PARAMS: nome, data_compra, nserie, descricao, pat_legado
      const result = await this.executeQuery(
        PatrimonyRepository.createPatrimonyQuery(),
        [nome, purchaseDate, nserie, descricao, pat_legado]
      );
      if (result) return result.insertId;
    } catch (e) {
      console.log("error in PatrimonyService.createPatrimony: m", e);
    }
  }

  static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("Error in executeQuery: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}
module.exports = PatrimonyService;
