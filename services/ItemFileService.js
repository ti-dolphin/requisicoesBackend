const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");

class ItemFileService {
  static async createItemFile(itemID, file, codpessoa) {
    if (!file) {
      throw new Error("File not provided");
    }



    const filePath = file.path;
    const query = `
      INSERT INTO anexos_item (arquivo, id_item, nome_arquivo, criado_por, criado_em)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      await fireBaseService.uploadFileToFireBase(filePath);
      const [allFiles] = await fireBaseService.getFilesFromFirebase();
      const createdFile = await fireBaseService.getFileByName(file.filename);
      const fileUrl = createdFile ? createdFile.publicUrl() : null;

      if (fileUrl) {
        const now = new Date();
        await this.executeQuery(query, [fileUrl, itemID, file.filename, codpessoa, utils.getCurrentDateTime()]);
        utils.removeFile(filePath);
      }

      return fileUrl;
    } catch (e) {
      console.log("Error in createItemFile: ", e);
      throw e;
    }
  }

  static async createItemFileFromLink(itemID, link) {
    const query = `
      INSERT INTO anexos_item (arquivo, id_item, nome_arquivo)
      VALUES (?, ?, ?)
    `;
    try {
      const result = await this.executeQuery(query, [link, itemID, link]);
      return result;
    } catch (e) {
      console.log("Error in createItemFileFromLink: ", e);
      throw e;
    }
  }

  static async deleteItemFile(filename, id) {
    const query = `DELETE FROM anexos_item WHERE id = ?`;
    try {
      const result = await this.executeQuery(query, [id]);
      await fireBaseService.deleteFileByName(filename);
      return result;
    } catch (e) {
      console.log("Error in deleteItemFile: ", e);
      throw e;
    }
  }

  static async getItemFilesByFileId(itemID) {
    const query = `SELECT * FROM anexos_item WHERE id_item = ?`;
    try {
      const result = await this.executeQuery(query, [itemID]);
      return result;
    } catch (e) {
      console.log("Error in getItemFilesByFileId: ", e);
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
      console.log("Error in executeQuery: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}

module.exports = ItemFileService;
