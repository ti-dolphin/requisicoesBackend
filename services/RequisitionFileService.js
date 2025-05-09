const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");
const { firebase } = require("googleapis/build/src/apis/firebase");

class RequisitionFilesService {
  static async createRequisitionFile(requisitionID, file, codpessoa) {
    console.log("createRequisitionFile SERVICE");
    const filePath = file.path;
    const query = `
      INSERT INTO dsecombr_controle.anexos_requisicao 
      (id_requisicao, arquivo, nome_arquivo, criado_por, criado_em) 
      VALUES (?, ?, ?, ?, ?)
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
        codpessoa,
        utils.getCurrentDateTime(),
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

  static async createRequisitionFileFromLink(id, link, codpessoa) {
    const query = `
      INSERT INTO dsecombr_controle.anexos_requisicao 
      (id_requisicao, arquivo, nome_arquivo, criado_por, criado_em) 
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const sanitizedLink = link.replace(/https?:\/\/|\/.*/g, "");
      const [result] = await RequisitionFilesService.executeQuery(query, [
        id,
        link,
        sanitizedLink,
        codpessoa,
        utils.getCurrentDateTime(),
      ]);
      return result;
    } catch (e) {
      console.log("Error in createRequisitionFileFromLink:", e);
      return null;
    }
  }

  static async getRequisitionFiles(requisitionID) {
    const query = `SELECT 
      id_requisicao, arquivo, nome_arquivo, id, criado_por,
      criado_em,
      JSON_OBJECT(
        'CODPESSOA', PESSOA.CODPESSOA,
        'NOME', PESSOA.NOME
      ) AS criado_por_pessoa
    FROM anexos_requisicao 
    LEFT JOIN PESSOA ON anexos_requisicao.criado_por = PESSOA.CODPESSOA
    WHERE id_requisicao = ?`;

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
      if (fireBasefile) {
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
