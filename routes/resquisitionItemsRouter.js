var express = require("express");
var router = express.Router();
const pool = require("../database");
const requisitionItemController = require("../controllers/requisitionItemController");

/* GET home page. */

// GET requisition/requisitionItems/:requisitionID
router.get("/:requisitionID", async function (req, res, next) {
  const [result] = await requisitionItemController.getRequisitionItem_by_reqID(
    req.params.requisitionID
  );
  if (result && result.length) res.status(200).send(result);
  else res.status(404).send();
});


router.post("/:requisitionID", async (req, res) => {
  console.log("POST");
  const result = await requisitionItemController.createRequisitionItems(
    req.body,
    req.params.requisitionID
  );
  if (result) res.status(200).send(`${result.insertId}`);
  else res.status(404).send("Ops, algo deu errado");
});

router.put("/:requisitionID/:id", async (req, res) => {
  console.log("PUT");
  const result = await requisitionController;
  res.send("update all requisition items with the received requisition ID");
});
module.exports = router;
