const fireBaseService = require("../services/fireBaseService");
const PatrimonyAccessoryService = require("../services/patrimonyAccessoryService");
const utils = require("../utils");

class PatrimonyAccessoryController {

  static async createAccessory(req, res) {
    try {
      const { nome, id_patrimonio, descricao } = req.body;
      const accessoryId = await PatrimonyAccessoryService.createAccessory(
        nome,
        id_patrimonio,
        descricao
      );
      res.status(201).json({ id_acessorio_patrimonio: accessoryId });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async getAccessoryById(req, res) {
    try {
      const { id } = req.params;
      const accessory = await PatrimonyAccessoryService.getAccessoryById(id);
      res.status(200).json(accessory);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async updateAccessory(req, res) {
    try {
      const { id } = req.params;
      const { nome, id_patrimonio } = req.body;
      const affectedRows = await PatrimonyAccessoryService.updateAccessory(
        id,
        nome,
        id_patrimonio
      );
      if (affectedRows > 0) {
        res.status(200).json({ message: "Accessory updated successfully" });
      } else {
        res.status(404).json({ message: "Accessory not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async deleteAccessory(req, res) {
    try {
      const { id } = req.params;
      const affectedRows = await PatrimonyAccessoryService.deleteAccessory(id);
      if (affectedRows > 0) {
        res.status(200).json({ message: "Accessory deleted successfully" });
      } else {
        res.status(404).json({ message: "Accessory not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getAccessoriesByPatrimonyId(req, res) {
    try {
      const { id_patrimonio } = req.params;
      const accessories =
        await PatrimonyAccessoryService.getAccessoriesByPatrimonyId(
          id_patrimonio
        );
      res.status(200).json(accessories);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getFilesByAccessoryId(req, res) {
    try {
      const { accessoryId } = req.params;
      const files = await PatrimonyAccessoryService.getFilesByAccessoryId(
        accessoryId
      );
      res.status(200).json(files);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async deletPatrimonyAccessoryFile(req, res) {
    try {
      const { id_anexo_acessorio_patrimonio, filename } = req.params;
      await fireBaseService.deleteFileByName(filename);
      const affectedRows =  await PatrimonyAccessoryService.deletPatrimonyAccessoryFile(
          id_anexo_acessorio_patrimonio
      );
      if (affectedRows > 0) {
        res.status(200).json({
          message: "Anexo de acessório de patrimônio deletado com sucesso",
        });
      } else {
        res
          .status(404)
          .json({ message: "Anexo de acessório de patrimônio não encontrado" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async createPatrimonyAccessoryFile(req, res) {
    try {
      const { file } = req;
      const { id_acessorio_patrimonio } = req.params;
      const insertId = await PatrimonyAccessoryService.createPatrimonyAccessoryFile(
          id_acessorio_patrimonio,
          file
);    
      if(insertId) {
         utils.removeFile(file.path);
      }
      return res
        .status(200)
        .send({ message: "Accessory File inserted successfully", insertId });
    } catch (e) {
      console.log("Error in createPatrimonyAccessoryFile: \n", e);
      return res.status(500).send("Internal server Error!");
    }
  }
}

module.exports = PatrimonyAccessoryController;
