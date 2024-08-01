const PersonService = require("../services/PersonService");

class PersonController {
  static async getAllPersons(req, res) {
    try {
      const result = await PersonService.getAllPersons();
      if (result && result.length) {
        res.status(200).send(result);
      } else {
        res.status(404).send("No persons found.");
      }
    } catch (error) {
      console.log("Error in getAllPersons:", error);
      res.status(500).send("Internal Server Error.");
    }
  }

  static async getPersonByID(req, res) {
    try {
      const { id } = req.params;
      const result = await PersonService.getPersonByID(id);
      if (result && result.length) {
        res.status(200).send(result[0]);
      } else {
        res.status(404).send("Person not found.");
      }
    } catch (error) {
      console.log("Error in getPersonByID:", error);
      res.status(500).send("Internal Server Error.");
    }
  }
}

module.exports = PersonController;
