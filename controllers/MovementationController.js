const MovementationService = require("../services/MovementationService");

class MovementationController {
  
  static async createMovementation(req, res) {
    const movementation = req.body;
    try {
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
    } catch (e) {
      console.log("error in MovementationController.createMovementation: ", e);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getMovementationsByPatrimonyId(req, res) {
    const { patrimonyId } = req.params;
    try {
      const movementations =
        await MovementationService.getMovementationsByPatrimonyId(patrimonyId);
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
    const { movementationFileId } = req.params;
    try {
      const affectedRows = await MovementationService.deleteMovementationFile(
        movementationFileId
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
    try {
      const insertId = await MovementationService.createMovementationFile(
        req.params.movementationId,
        req.file
      );
      if (insertId) {
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
