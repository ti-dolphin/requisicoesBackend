
var CheckListService = require('../services/CheckListService');

class CheckListController {
  static createChecklistItemFile = async (req, res) => {
    try {
      const file = req.file;
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
    } catch (e) {
      console.log("Error creating: ", e.message);
      res.status(500).send("Internal Server Error");
    }
  };

  static updateChecklistItemFile = async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }
    try {
      const fileUrl = await CheckListService.updateChecklistItemfile(
        req.params.id_item_checklist_movimentacao,
        file
      );
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
        reprovado
      } = req.body;
   
      const result = await CheckListService.updatedChecklist({
        id_checklist_movimentacao,
        id_movimentacao,
        data_criacao,
        realizado,
        data_realizado,
        aprovado,
        data_aprovado,
        observacao,
        reprovado
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

  static async getChecklistItems(req, res) {
    try {
      const { id_patrimonio, id_movimentacao, id_checklist_movimentacao } =
        req.params;
      const checklistItems = await CheckListService.getChecklistItems(
        id_patrimonio,
        id_movimentacao,
        id_checklist_movimentacao
      );
   
      return res.status(200).send(checklistItems);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  static async updateChecklistItems(req, res) {
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
 
    const { CODPESSOA, status } = req.query;
    console.log({
      CODPESSOA,
      status,
    });
    try {
      const notifications = await CheckListService.getChecklistNotifications(
        CODPESSOA, status
      );
      res.status(200).send(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }

  static async getChecklistByPatrimonyId(req, res) {
    const { id_patrimonio } = req.params;
    try {
      const checklists = await CheckListService.getChecklistByPatrimonyId(
        id_patrimonio
      );
      return res.status(200).send(checklists);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
};

module.exports = CheckListController;