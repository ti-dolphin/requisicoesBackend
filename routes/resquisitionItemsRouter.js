var express = require("express");
var router = express.Router();
const RequisitionItemController = require("../controllers/requisitionItemController");

// GET /requisitionItems/:requisitionID
router.get("/:requisitionID", async function (req, res, next) {
  console.log('req params: ', req.params)
  await RequisitionItemController.getRequisitionItemByReqID(req, res);
});

// POST /requisitionItems/:requisitionID
router.post("/:requisitionID", async (req, res, next) => {
   await RequisitionItemController.createRequisitionItems(req, res);
  //  next();
});

// DELETE /requisitionItems/:requisitionID/:productID
router.delete("/:requisitionID/:productID", async (req, res, next) => {
   await RequisitionItemController.deleteRequisitionItem( req, res );
  //  next();
});

// PUT /requisitionItems/:requisitionID
router.put("/:requisitionID", async (req, res, next) => {
   await RequisitionItemController.updateRequisitionItems(req, res);
});

module.exports = router;
