
const ItemFileService = require("../services/ItemFileService");
class ItemFileController {
  static async createItemFile(req, res) {
    const { itemID } = req.params;
    const {codpessoa} = user.query;

    const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded");
      }
      try {
        const fileUrl = await ItemFileService.createItemFile(itemID, file, codpessoa);
        if (fileUrl) {
          res.status(200).send({ fileUrl });
        } else {
          res.status(500).send("Failed to upload file");
        }
      } catch (e) {
        console.log("Error in createItemFile: ", e);
        res.status(500).send("Internal Server Error");
      }
  }

  static async createItemFileFromLink(req, res) {
    const { itemID } = req.params;
    const { link } = req.body;

    try {
      const result = await ItemFileService.createItemFileFromLink(itemID, link);
      if (result) {
        res.status(200).send({ id: result.insertId });
      } else {
        res.status(500).send("Failed to create file from link");
      }
    } catch (e) {
      console.log("Error in createItemFileFromLink: ", e);
      res.status(500).send("Internal Server Error");
    }
  }

  static async deleteItemFile(req, res) {
    const { filename, id } = req.params;

    try {
      const result = await ItemFileService.deleteItemFile(filename, id);
      if (result.affectedRows > 0) {
        res.status(200).send("File deleted successfully");
      } else {
        res.status(404).send("File not found");
      }
    } catch (e) {
      console.log("Error in deleteItemFile: ", e);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getItemFilesByFileId(req, res) {
    const { itemID } = req.params;
    try {
      const files = await ItemFileService.getItemFilesByFileId(itemID);
      if (files.length) {
        res.status(200).send(files);
      } else {
        res.status(404).send("No files found");
      }
    } catch (e) {
      console.log("Error in getItemFilesByFileId: ", e);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = ItemFileController;
