const RequisitionFilesService = require("../services/RequisitionFileService");

class RequisitionFilesController {

  static async createRequisitionFile(req, res) {
    const { requisitionID } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).send("File is required.");
    }

    try {
      const fileUrl = await RequisitionFilesService.createRequisitionFile(
        requisitionID,
        file
      );
      if (fileUrl) {
        res.status(200).send(fileUrl);
      } else {
        res.status(500).send("Error uploading file.");
      }
    } catch (error) {
      console.log("Error in createRequisitionFile:", error);
      res.status(500).send("Internal Server Error.");
    }
  }

  static async createRequisitionFileFromLink(req, res) {
    const { requisitionID } = req.params;
    const { link } = req.body;

    if (!link) {
      return res.status(400).send("Link is required.");
    }
    try {
      const result =
        await RequisitionFilesService.createRequisitionFileFromLink(
          requisitionID,
          link
        );
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(500).send("Error uploading file from link.");
      }
    } catch (error) {
      console.log("Error in createRequisitionFileFromLink:", error);
      res.status(500).send("Internal Server Error.");
    }
  }

  static async getRequisitionFiles(req, res) {
    const { requisitionID } = req.params;

    try {
      const files = await RequisitionFilesService.getRequisitionFiles(
        requisitionID
      );
      if (files && files.length) {
        res.status(200).send(files);
      } else {
        res.status(404).send("No files found.");
      }
    } catch (error) {
      console.log("Error in getRequisitionFiles:", error);
      res.status(500).send("Internal Server Error.");
    }
  }

  static async deleteRequisitionFile(req, res) {
    const { fileID } = req.params;

    try {
      const result = await RequisitionFilesService.deleteRequisitionFile(
        fileID
      );
      if (result.affectedRows > 0) {
        res.status(200).send("File deleted successfully.");
      } else {
        res.status(404).send("File not found.");
      }
    } catch (error) {
      console.log("Error in deleteRequisitionFile:", error);
      res.status(500).send("Internal Server Error.");
    }
  }
}

module.exports = RequisitionFilesController;
