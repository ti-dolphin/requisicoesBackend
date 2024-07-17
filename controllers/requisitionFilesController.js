const { json } = require("express");
const pool = require("../database");
const fireBaseService = require('../services/fireBaseService');
const utils = require('../utils');

const requisitionFilesController = {
  createRequisitionFile: async (requisitionID, file) => {
    const filePath = file.path;
    // console.log("file - createRequisitionFile: ", file);
    const query = `INSERT INTO
          dsecombr_controle.anexos_requisicao
          (id_requisicao, arquivo, nome_arquivo)
           VALUES (?, ?, ?)`;
    try {
      const transaction = await fireBaseService.uploadFileToFireBase(filePath);
      const [allFiles] = await fireBaseService.getFilesFromFirebase();
      const createdFile = allFiles.find((item) => item.name === file.filename);
      const fileUrl = createdFile.publicUrl();
      await requisitionFilesController.executeQuery(query, [
        requisitionID,
        fileUrl,
        file.filename,
      ]);
      if(fileUrl) utils.removeFile(filePath);
      return fileUrl;
    } catch (e) {
      console.log("erro: ", e);
      return null;
    }
  },

  getRequisitionFiles: async (requisitionID) => {
    const query = `SELECT * FROM dsecombr_controle.anexos_requisicao where id_requisicao = ?`;
    try {
      const [rows, fields] = await requisitionFilesController.executeQuery(
        query,
        [requisitionID]
      );
      return rows;
    } catch (e) {
      console.log("erro getRequisitionFiles: ", e);
      return null;
    }
  },

  deleteRequisitionFile: async (fileID) => { 
    const query = `DELETE FROM dsecombr_controle.anexos_requisicao where id = ?`;
    try{ 
      const [result] = await requisitionFilesController.executeQuery(query, [fileID]);
      if(result.affectedRows > 0) return result;
      else throw new Error('Something went wrong');
    }catch(e){ 
      console.log(e);
      return null;
    }
  },

  executeQuery: async (query, params) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query, params);
      (await connection).release();
      return result;
    } catch (queryError) {
      console
        .log(
          "queryError: ",
          queryError
        )(await connection)
        .release();
      throw queryError;
    }
  },
};

module.exports = requisitionFilesController;
