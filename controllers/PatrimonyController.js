const PatrimonyService = require("../services/PatrimonyService");
const utils = require("../utils");

class PatrimonyController {
  static async deletePatrimony(req, res) {
    const { patrimonyId } = req.params;
    try {
      const affectedRows = await PatrimonyService.deletePatrimony(patrimonyId);
      if (affectedRows) {
        return res.status(200).send({
          message: "Patrimony deleted successfully!",
          affectedRows,
        });
      } else {
        return res.status(404).send({
          message: "Patrimony not found or already deleted.",
        });
      }
    } catch (e) {
      console.error("Error in PatrimonyController.deletePatrimony:", e);
      return res.status(500).send({
        message: "Internal server error while deleting patrimony",
        error: e,
      });
    }
  }

  static async getInactivePatrymonyInfo(req, res) {
    try {
      const InactivePatrymonyInfo =
        await PatrimonyService.getInactivePatrymonyInfo();
      return res.status(200).send(InactivePatrymonyInfo);
    } catch (e) {
      return res
        .status(500)
        .send({ message: "error getting inactive patrimony", error: e });
    }
  }

  static async updatePatrimonies(req, res) {

   try {
     const ids = req.body.selectedItems.map((patrimony) => patrimony.id_patrimonio);
     const affectedRows = await PatrimonyService.updatePatrimonies(ids, req.body.active);
     return res
       .status(200)
       .send({ message: "patrimonies updated successfully!", affectedRows });
   } catch (e) {
     return res
       .status(500)
       .send({ message: "error updating multiple patrimonies", error: e });
   }
  }

  static async getPatrimonyResponsable(req, res) {
    const { patrimonyId } = req.params;
    try {
      const responsableId = await PatrimonyService.getPatrimonyResponsable(
        patrimonyId
      );
      return res.status(200).send(responsableId);
    } catch (e) {
      console.log("error in getPatrimonyResponsable");
      res.status(500).send({ message: "Error getting resopnsable", error: e });
    }
  }

  static async getPatrimonyType(req, res) {
    try {
      const patrimonyTypes = await PatrimonyService.getPatrimonyType();
      res.status(200).json(patrimonyTypes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching patrimony types", error });
    }
  }

  static async deletePatrimonyFile(req, res) {
    const { patrimonyFileId, filename } = req.params;
    try {
      const affectedRows = await PatrimonyService.deletePatrimonyFile(
        patrimonyFileId,
        filename
      );
      if (affectedRows)
      return res
        .status(200)
        .send({ message: "Deleted Successfully", affectedRows });
    } catch (e) {
      return res.status(500).send("Internal server Error");
    }
  }

  static async createPatrimonyFile(req, res) {
    try {
      const { file } = req;
      const { patrimonyId } = req.params;
      const insertId = await PatrimonyService.createPatrimonyFile(
        patrimonyId,
        file
      );
      utils.removeFile(file.path);
      return res
        .status(200)
        .send({ message: "Patrimony File inserted Successfuly", insertId });
       
    } catch (e) {
      console.log("error in createPatrimonyFile : \n", e);
      return res.status(500).send("Internal server Error!");
    }
  }

  static async getPatrimonyFiles(req, res) {
    const { patrimonyId } = req.params;
    try {
      const patrimonyFiles = await PatrimonyService.getPatrimonyFiles(
        patrimonyId
      );
      if (patrimonyFiles) return res.status(200).send(patrimonyFiles);
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  }

  static async getSinglePatrimonyInfo(req, res) {
    try {
      const { patrimonyId } = req.params;
      const patrimonyInfo = await PatrimonyService.getSinglePatrimonyInfo(
        patrimonyId
      );
      if (patrimonyInfo) return res.status(200).send(patrimonyInfo);
    } catch (e) {
      return res.status(500).send("Internal Server Erorr");
    }
  }

  static async getPatrimonyInfo(req, res) {
    const { user, filter: currentFilter } = req.query;

    try {
      const patrimonyInfo = await PatrimonyService.getPatrimonyInfo({
        user,
        filter: currentFilter,
      });
      if (patrimonyInfo) {
        return res.status(200).send(patrimonyInfo);
      }
      return res.status(404).send({ message: "Patrimony Info not found!" });
    } catch (e) {
      console.log("Error in getPatrimonyInfo: ", e);
      res.status(500).send("Internal Server Error");
    }
  }

  static async createPatrimony(req, res) {
    const patrimony = req.body;
    try {
      const insertId = await PatrimonyService.createPatrimony(patrimony);
      if (insertId)
        return res
          .status(200)
          .send({ message: "patrimony created successfully!", insertId });
    } catch (e) {
      console.log("error in PatrimonyController.createPatrimony: \n", e);
    }
  }

  static async updatePatrimony(req, res) {
    try {
      const affectedRows = await PatrimonyService.updatePatrimony(req.body);
      if (affectedRows)
        return res.status(200).send({
          message: "Movementation Updated Successfully!",
          affectedRows,
        });
    } catch (e) {
      console.log("\nerror - updatePatrimony\n", e);
      return res.status(500).send("Internal Server Error");
    }
  }
}
module.exports = PatrimonyController;
