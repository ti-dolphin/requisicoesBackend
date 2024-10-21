const CheckListService = require("../services/CheckListService");
const MovementationService = require("../services/MovementationService");
const utils = require("../utils");
class MovementationController {
  static async acceptMovementation(req, res){ 
    const {movementationId} = req.params;
    try{ 
        const affectedRows = await MovementationService.acceptMovementation(
          movementationId
        );
        return res.status(200).send({ 
          message: "Movementation Accepted Successfully!",
          affectedRows,
        })
    }catch(e){ 
      return res.status(500).send('Internal Server Error');
    }
  }
  
  static async createMovementation(req, res) {
    const movementation = req.body;
    try {
      const creationPermitted = await this.noUndoneChecklists(movementation);
      const firstMovementation = await this.isFirstMovementation(movementation);
      if (creationPermitted || firstMovementation) {
        const insertId = await MovementationService.createMovementation(
          movementation
        );
        if (insertId) {
          console.log({
            message: "Movementation created Successfully",
            insertId,
          });
          return res.status(200).send({
            message: "Movementation created Successfully",
            insertId,
          });
        }
      }
      return res.status(201).send({message: 'Não foi possível criar a movimentacção pois há um checklist não realizado! Faça o checklist antes de transferir o patrimônio'});

    } catch (e) {
      console.log("error in MovementationController.createMovementation: ", e);
      res.status(500).send("Internal Server Error");
    }
  }

  static isFirstMovementation = async (movementation) => {
    const movementations = await MovementationService.getMovementationsByPatrimonyId(movementation.id_patrimonio);
    if (movementations && movementations.length > 0) {
      return false;
    }
    return true;
  }

  static noUndoneChecklists = async (movementation) => { 
    const unddoneChecklists = await CheckListService.getUndoneChecklistsByMovementation(movementation);
    if(unddoneChecklists){ 
      return true;
    }
    return false;
  }

  static async getMovementationsByPatrimonyId(req, res) {
    const { patrimonyId } = req.params;
    try {
      const movementations = await MovementationService.getMovementationsByPatrimonyId(patrimonyId);
      if (movementations) return res.status(200).send(movementations);
      return res.status(404).send({ message: "No Movementations Found!" });
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  }

  static async getMovementationFiles(req, res) {
    const { movementationId } = req.params;
    try {
      const movementationFiles =
        await MovementationService.getMovementationFiles(movementationId);
      if (movementationFiles) return res.status(200).send(movementationFiles);
      else
        return res
          .status(404)
          .send({ message: "Movementation Files not Found!" });
    } catch (e) {
      return res.status(500).send("internal Server Error");
    }
  }

  static async updateMovementation(req, res) {
    try {
      const affectedRows = await MovementationService.updateMovementation(
        req.body
      );
      if (affectedRows)
        return res.status(200).send({
            message: "Movementation Updated Successfully!",
            affectedRows,
          });
    } catch (e) {
      console.log("error in updateMovementation: ", e);
      return res.status(500).send("Internal Server Error");
    }
  }

  static async deleteMovementationFile(req, res) {
    const { movementationFileId, filename } = req.params;
    try {
      const affectedRows = await MovementationService.deleteMovementationFile(
        movementationFileId,
        filename
      );
      if (affectedRows)
        return res
          .status(200)
          .send({ message: "Deleted Successfully", affectedRows });
    } catch (e) {
      console.log("error deleteMovementationFile: ", e);
      return res.status(500).send("Internal server Error");
    }
  }

  static async deleteMovementation(req, res){ 
   try{ 
      const { movementationId } = req.params;
      console.log("movementationId: ", movementationId);
      const affectedRows = await MovementationService.deleteMovementation(
        movementationId
      );
      return res.status(200).send({message: 'Movementation Deleted Successfully', affectedRows});
   }catch(e){ 
    return res.status(500).send('interal server error');
   }

  }
  static async createMovementationFile(req, res) {
    const  { file } = req;
    try {
      const insertId = await MovementationService.createMovementationFile(
        req.params.movementationId,
        req.file
      );
      if (insertId) {
        utils.removeFile(file.path);
        return res.status(200).send({
          message: "Successfully created Movementation File",
          insertId,
        });
      }
    } catch (e) {
      return res.status(500).send("Internal Server Error");
    }
  }

  static async getMovementationFiles(req, res) {
    const { movementationId } = req.params;
    try {
      const movementationFiles =
        await MovementationService.getMovementationFiles(movementationId);
      if (movementationFiles) return res.status(200).send(movementationFiles);
    } catch (e) {
      return res.status(500).send("Internal Server Error");
    }
  }
}
module.exports = MovementationController;
