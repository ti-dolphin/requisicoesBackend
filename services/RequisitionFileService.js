const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");
const { firebase } = require("googleapis/build/src/apis/firebase");

class RequisitionFilesService {
  static async createRequisitionFile(requisitionID, file) {
    console.log("createRequisitionFile SERVICE");
    const filePath = file.path;
    const query = `
      INSERT INTO dsecombr_controle.anexos_requisicao 
      (id_requisicao, arquivo, nome_arquivo) 
      VALUES (?, ?, ?)
    `;
    try {
      await fireBaseService.uploadFileToFireBase(filePath);
      const [allFiles] = await fireBaseService.getFilesFromFirebase();
      const createdFile = allFiles.find((item) => item.name === file.filename);
      const fileUrl = createdFile.publicUrl();

      await RequisitionFilesService.executeQuery(query, [
        requisitionID,
        fileUrl,
        file.filename,
      ]);

      if (fileUrl) {
        utils.removeFile(filePath);
      }
      return fileUrl;
    } catch (e) {
      console.log("Error in createRequisitionFile:", e);
      return null;
    }
  }

  static async createRequisitionFileFromLink(id, link) {
    const query = `
      INSERT INTO dsecombr_controle.anexos_requisicao 
      (id_requisicao, arquivo, nome_arquivo) 
      VALUES (?, ?, ?)
    `;

    try {
      const sanitizedLink = link.replace(/https?:\/\/|\/.*/g, '');
      const [result] = await RequisitionFilesService.executeQuery(query, [
        id,
        link,
        sanitizedLink,
      ]);
      return result;
    } catch (e) {
      console.log("Error in createRequisitionFileFromLink:", e);
      return null;
    }
  }

  static async getRequisitionFiles(requisitionID) {
    const query = `
      SELECT * 
      FROM dsecombr_controle.anexos_requisicao 
      WHERE id_requisicao = ?
    `;

    try {
      const [rows, fields] = await RequisitionFilesService.executeQuery(query, [
        requisitionID,
      ]);
      return rows;
    } catch (e) {
      console.log("Error in getRequisitionFiles:", e);
      return null;
    }
  }

  static async deleteRequisitionFile(filename, fileID) {
    console.log("deleteRequisitionFile SERVICE", filename, fileID);
    const query = `
      DELETE FROM dsecombr_controle.anexos_requisicao 
      WHERE id = ?
    `;
    try {
      const fireBasefile = await fireBaseService.getFileByName(filename);
      if(fireBasefile) {
        await fireBasefile.delete();
        console.log("Arquivo deletado do Firebase: ", filename);
      }
      const [result] = await RequisitionFilesService.executeQuery(query, [
        fileID,
      ]);
      return result;
    } catch (e) {
      console.log("Erro ao deletar anexo: ", e);
      throw new Error("Erro ao deletar anexo: ", e);
    }
  }

  static async executeQuery(query, params = []) {
    const connection = await pool.getConnection();
    try {
      const result = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("queryError: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}

module.exports = RequisitionFilesService;
