const OpportunityService = require("../services/OpportunityService");
const PersonService = require("../services/PersonService");

class OpportunityController {
  static createOpportunity = async (req, res) => {
    try {
      const newOpportunityId = await OpportunityService.createOpportunity(
        req.body
      );
      return res
        .status(200)
        .send({
          message: "Opportunity created successfully",
          insertId: newOpportunityId,
        });
    } catch (e) {
      console.error("Error creating opportunity: ", e.message);
      return res.status(500).send("Server Error");
    }
  };
  static getClients = async (req, res) => {
    try {
      const clients = await PersonService.getClients();
      //   console.log("clients: ", clients);
      return res.status(200).send(clients);
    } catch (err) {
      console.log("error getting clients: ", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  static getStatusList = async (req, res) => {
    try {
      const statusList = await OpportunityService.getOppStatusList();
      //   console.log("statusList: ", statusList);
      return res.status(200).send(statusList);
    } catch (e) {
      console.log("error getting status list: ", e.message);
      res.status(500).json({ error: e.message });
    }
  };
  static getSalers = async (req, res) => {
    try {
      const salers = await PersonService.getSallers();
      //   console.log("salers: ", salers);
      return res.status(200).send(salers);
    } catch (err) {
      console.log("error getting sales: ", err.message);
      res.status(500).json({ error: e.message });
    }
  };
  static getOpportunities = async (req, res) => {
    try {
      const opps = await OpportunityService.getOpportunities(req.query);
      return res.status(200).send(opps);
    } catch (e) {
      console.log("error getting opportunities: ", e.message);
      res.status(500).json({ error: e.message });
    }
  };
}

module.exports = OpportunityController;
