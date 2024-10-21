
var CheckListService = require('../services/CheckListService');

class CheckListController {
  static createChecklistItemFile = async(req, res ) => { 
    try{ 
      const file = req.file;
      console.log('file: ', file);;
      if (!file) {
        return res.status(400).send("No file uploaded");
      }
       const fileUrl = await CheckListService.createChecklistItemFile(
         req.body.checklistItemFile,
         file
       );
       if (fileUrl) {
         res.status(200).send({ fileUrl });
       } else {
         res.status(500).send("Failed to upload file");
       }
    }catch(e){ 
      console.log('Error creating: ', e.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static updateChecklistItemFile = async (req, res) => {
    console.log('UpdateChecklistItemFile');
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }
    try {
      const fileUrl = await CheckListService.updateChecklistItemfile(
        req.params.id_item_checklist_movimentacao,
        file
      );
      console.log('file url: ' + fileUrl)
      if (fileUrl) {
        res.status(200).send({ fileUrl });
      } else {
        res.status(500).send("Failed to upload file");
      }
    } catch (e) {
      console.log("Error in updateChecklistItemFile: ", e);
      res.status(500).send("Internal Server Error");
    }
  };

  static async updatetChecklist(req, res) {
    console.log("updatetChecklist");
    try {
      const {
        id_checklist_movimentacao,
        id_movimentacao,
        data_criacao,
        realizado,
        data_realizado,
        aprovado,
        data_aprovado,
        observacao,
      } = req.body;
      console.log({
        id_checklist_movimentacao,
        id_movimentacao,
        data_criacao,
        realizado,
        data_realizado,
        aprovado,
        data_aprovado,
        observacao,
      });
      const result = await CheckListService.updatedChecklist({
        id_checklist_movimentacao,
        id_movimentacao,
        data_criacao,
        realizado,
        data_realizado,
        aprovado,
        data_aprovado,
        observacao,
      });
      if (result)
        return res
          .status(200)
          .send({ message: "checklist was updated successfully!" });
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  }

  static async getChecklistItemsMap(req, res) {
    try {
      const { id_patrimonio, id_movimentacao, id_checklist_movimentacao } =
        req.params;
      const itemsMap = await CheckListService.getChecklistItemsMap(
        id_patrimonio,
        id_movimentacao,
        id_checklist_movimentacao
      );
      return res.status(200).send(itemsMap);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  static async updateChecklistItems(req, res) {
    console.log("updateChecklistItems");
    const { checklistItems } = req.body;

    try {
      await CheckListService.updateChecklistItems(checklistItems);
      return res.status(200).send("Items created successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  static async getChecklistNotifications(req, res) {
    console.log("getChecklistNotifications");
    const { CODPESSOA } = req.query;
    try {
      const notifications = await CheckListService.getChecklistNotifications(
        CODPESSOA
      );
      res.status(200).send(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  static async getChecklistsByMovementationID(req, res) {
    const { id_movimentacao } = req.params;
    try {
      const checklists = await CheckListService.getChecklistsByMovementationID(
        id_movimentacao
      );
      return res.status(200).send(checklists);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
};

module.exports = CheckListController;