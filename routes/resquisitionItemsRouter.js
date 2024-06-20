var express = require("express");
var router = express.Router();
const pool = require("../database");
const requisitionItemController = require("../controllers/requisitionItemController");

/* GET home page. */

// GET requisition/requisitionItems/:requisitionID
router.get("/:requisitionID", async function (req, res, next) {
  console.log('caiu no get');
  const result = await requisitionItemController.getRequisitionItem_by_reqID(
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
router.delete("/:requisitionID/:productID", async ( req, res ) =>  {
  const result = await requisitionItemController.deleteRequisitionItem_by_reqID(req.params.requisitionID, req.params.productID);
  if(result.affectedRows > 0) res.status(200).send();
  else res.status(404).send();
})

router.put("/:requisitionID", async (req, res) => {
  console.log("PUT");
  const result = await requisitionItemController.updateRequisitionItems(req.body);
  if(result === req.body.length) res.status(200).send();
  else res.status(404).send();
});
module.exports = router;
