const { json } = require("express");
const pool = require("../database");
const fireBaseService = require('../services/fireBaseService');
const utils = require('../utils');

const itemFileController = {
  createItemFile: async (itemID, file) => {
    console.log('caiu no createFile');
    const filePath = file.path;
     console.log("file - createItemFile: ", file);
    const query =
      "INSERT INTO anexos_item (arquivo, id_item, nome_arquivo) VALUES (?, ?, ? )";
     try {
       const transaction = await fireBaseService.uploadFileToFireBase(filePath);
       const [allFiles] = await fireBaseService.getFilesFromFirebase();
       const createdFile = allFiles.find((item) => item.name === file.filename);
       const fileUrl = createdFile.publicUrl();
       console.log("fileUrl - createItemFile ", fileUrl);
       await itemFileController.executeQuery(query, [
         fileUrl,
         itemID,
         file.filename,
       ]);
       if (fileUrl) utils.removeFile(filePath);
       console.log("fileUrl - createItemFile ", fileUrl);
       return fileUrl;
     } catch (e) {
       console.log("erro: ", e);
       return null;
     }
  },

   deleteItemFile: async(id ) => { 
        const query = `DELETE FROM anexos_item WHERE id = ?`;
        try{ 
            const result = await itemFileController.executeQuery(query, [id]);
            return result;
        }catch(e){ 
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