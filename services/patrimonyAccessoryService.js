const PatrimonyAccessoryRepository = require("../repositories/patrimonyAccessoryRepository");
const pool = require("../database");
const fireBaseService = require("./fireBaseService");


class PatrimonyAccessoryService {
  static async createAccessory(nome, id_patrimonio, descricao) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.createAccessoryQuery(),
        [nome, id_patrimonio, descricao]
      );
      return result.insertId;
    } catch (e) {
      console.error("Error in PatrimonyAccessoryService.createAccessory:", e);
      throw e;
    }
  }

  static async getAccessoryById(id_acessorio_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.getAccessoryByIdQuery(),
        [id_acessorio_patrimonio]
      );
      return result[0]; // Assuming the result is an array
    } catch (e) {
      console.error("Error in PatrimonyAccessoryService.getAccessoryById:", e);
      throw e;
    }
  }

  static async updateAccessory(id_acessorio_patrimonio, nome, id_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.updateAccessoryQuery(),
        [nome, id_patrimonio, id_acessorio_patrimonio]
      );
      return result.affectedRows;
    } catch (e) {
      console.error("Error in PatrimonyAccessoryService.updateAccessory:", e);
      throw e;
    }
  }

  static async deleteAccessory(id_acessorio_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.deleteAccessoryQuery(),
        [id_acessorio_patrimonio]
      );
      return result.affectedRows;
    } catch (e) {
      console.error("Error in PatrimonyAccessoryService.deleteAccessory:", e);
      throw e;
    }
  }

  static async getAccessoriesByPatrimonyId(id_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.getAccessoriesByPatrimonyIdQuery(),
        [id_patrimonio]
      );
      return result;
    } catch (e) {
      console.error(
        "Error in PatrimonyAccessoryService.getAccessoriesByPatrimonyId:",
        e
      );
      throw e;
    }
  }

  static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.error("Error in executeQuery:", queryError);
      connection.release();
      throw queryError;
    }
  }
  static async getFilesByAccessoryId(id_acessorio_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.getFilesByAccessoryIdQuery(),
        [id_acessorio_patrimonio]
      );
      return result;
    } catch (e) {
      console.error(
        "Error in PatrimonyAccessoryService.getFilesByAccessoryId:",
        e
      );
      throw e;
    }
  }

  static async deletPatrimonyAccessoryFile(id_anexo_acessorio_patrimonio) {
    try {
      const result = await this.executeQuery(
        PatrimonyAccessoryRepository.deletPatrimonyAccessoryFileQuery(),
        [id_anexo_acessorio_patrimonio]
      );
      return result.affectedRows;
    } catch (e) {
      console.error(
        "Error in PatrimonyAccessoryService.deleteAnexoAcessorioPatrimonio:",
        e
      );
      throw e;
    }
  }
  
  static async createPatrimonyAccessoryFile(id_acessorio_patrimonio, file) {
    const { path, filename } = file;
    const fileUrl = await this.getFileUrl(path, filename);
    const result = await this.executeQuery(
      PatrimonyAccessoryRepository.createPatrimonyAccessoryFileQuery(),
      [fileUrl, filename, id_acessorio_patrimonio]
    );
    return result.insertId;
  }

  static async getFileUrl(path, filename) {
    await fireBaseService.uploadFileToFireBase(path);
    const [allFiles] = await fireBaseService.getFilesFromFirebase();
    const createdFile = allFiles.find((item) => item.name === filename);
    return createdFile.publicUrl();
  }
}

module.exports = PatrimonyAccessoryService;
