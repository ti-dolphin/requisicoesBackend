const { json } = require("express");
const pool = require("../database");
const fs = require("fs");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { v4: uuidv4 } = require("uuid");
const { create } = require("domain");
const { error } = require("console");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://dolphin-8f800.appspot.com",
});

const requisitionFilesController = {
  createRequisitionFile: async (requisitionID, file) => {
    const fileContent = await fs.promises.readFile(file.path);
    const filePath = file.path;
    console.log("fileName: ", file.filename);
    const query = `INSERT INTO
          dsecombr_controle.anexos_requisicao
          (id_requisicao, arquivo, nome_arquivo)
           VALUES (?, ?, ?)`;
    try {
      const transaction = await requisitionFilesController.uploadFileToFireBase(
        filePath
      );
      const [allFiles] = await requisitionFilesController.getFilesFromFirebase();
      const createdFile = allFiles.find((item) => item.name === file.filename);
      const fileUrl = createdFile.publicUrl();
      await requisitionFilesController.executeQuery(query, [
        requisitionID,
        fileUrl,
        file.filename,
      ]);
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

  getFilesFromFirebase: async () => {
    requisitionFilesController.makeAllFilesPublic();
    const bucket = admin.storage().bucket();
    const bucketFiles = await bucket.getFiles();
    return bucketFiles;
  },

  makeAllFilesPublic: () => {
    const bucket = admin.storage().bucket();
    try {
      const opts = {
        includeFiles: true,
        force: true,
      };
      bucket.makePublic(opts, function (errors, files) {});
    } catch (e) {
      console.log(e);
    }
  },

  uploadFileToFireBase: async (filePath) => {
    console.log("1 - UPLOADFILES TO FIREBASE");
    try {
      const bucket = admin.storage().bucket();
      await bucket.upload(filePath, {
        metadata: {
          metadata: { firebaseStorageDownloadTokens: uuidv4() },
        },
      });
      return "file uploaded!";
    } catch (e) {
      console.log("2 - error");
    }
  },

  //===================SQL METHODS

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