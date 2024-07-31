var express = require("express");
var router = express.Router();
const RequisitionController = require("../controllers/requisitionController");
const pool = require("../database");

// GET /requisition/
router.get("/", RequisitionController.getRequisitions);

router.get("/:id", RequisitionController.getRequisitionByID);

router.post("/", RequisitionController.insertRequisitions);

router.put("/:requisitionID", RequisitionController.updateRequisitionById);

router.delete("/:requisitionID", RequisitionController.deleteRequisitionById);

module.exports = router;
