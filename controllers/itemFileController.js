const { json } = require("express");
const pool = require("../database");
const fireBaseService = require("../services/fireBaseService");
const utils = require("../utils");

const itemFileController = {
  createItemFile: async (itemID, file) => {
    if (file) {
      const filePath = file.path;
      const query =
        "INSERT INTO anexos_item (arquivo, id_item, nome_arquivo) VALUES (?, ?, ? )";
      try {
        const transaction = await fireBaseService.uploadFileToFireBase(
          filePath
        );
        const [allFiles] = await fireBaseService.getFilesFromFirebase();
        const createdFile = allFiles.find(
          (item) => item.name === file.filename
        );
        const fileUrl = createdFile.publicUrl();
        await itemFileController.executeQuery(query, [
          fileUrl,
          itemID,
          file.filename,
        ]);
        if (fileUrl) utils.removeFile(filePath);
        return fileUrl;
      } catch (e) {
        console.log("erro: ", e);
        return null;
      }
    }
  },
  createItemFileFromLink: async (itemID, req) => {
    const { link } = req.body;
    console.log(" 2 - link ", link);
    const query =
      "INSERT INTO anexos_item (arquivo, id_item, nome_arquivo) VALUES (?, ?, ? )";
    try {
      const [result] = await itemFileController.executeQuery(query, [link, itemID, link]);
      if (result ) return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  
  deleteItemFile: async (id) => {
    const query = `DELETE FROM anexos_item WHERE id = ?`;
    try {
      const result = await itemFileController.executeQuery(query, [id]);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  getItemFilesByFileId: async (itemID) => {
    const query = `SELECT * FROM anexos_item WHERE id_item = ?`;
    const [result] = await itemFileController.executeQuery(query, [itemID]);
    return result;
  },

  executeQuery: async (query, params) => {
    const connection = pool.getConnection();
    try {
      const result = (await connection).query(query, params);
      (await connection).release();
      // console.log('result: itemFileController ', result);
      return result;
    } catch (queryError) {
      console
        .log(
          "queryErro: ",
          queryError
        )(await connection)
        .release();
      throw queryError;
    }
  },
};
module.exports = itemFileController;
