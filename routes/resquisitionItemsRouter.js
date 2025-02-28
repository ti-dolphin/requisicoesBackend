var express = require("express");
var router = express.Router();
const RequisitionItemController = require("../controllers/requisitionItemController");

// GET /requisitionItems/:requisitionID
router.get("/:requisitionID",  function (req, res, next) {
   RequisitionItemController.getRequisitionItemByReqID(req, res);
});

// POST /requisitionItems/:requisitionID
router.post("/:requisitionID",  (req, res, next) => {
    RequisitionItemController.createRequisitionItems(req, res);
  //  next();
});

// DELETE /requisitionItems/:requisitionID/:productID
router.delete("/:requisitionID/",  (req, res, next) => {
    RequisitionItemController.deleteRequisitionItems( req, res );
  //  next();
});

// PUT /requisitionItems/:requisitionID
router.put("/:requisitionID",  (req, res, next) => {
    RequisitionItemController.updateRequisitionItems(req, res);
});

module.exports = router;
