var express = require("express");
var router = express.Router();
const RequisitionController = require("../controllers/requisitionController");

// GET /requisition/
router.get("/", RequisitionController.getRequisitions);

router.get("/status", RequisitionController.getStatusList);
router.get(
  "/status/previous/:requisitionID",
  RequisitionController.getPreviousStatus
);

router.get('/kanban', RequisitionController.getRequisitionKanban)

router.get('/types', RequisitionController.getTypes);

router.get(
  "/statusChanges/:requisitionID",
  RequisitionController.getStatusChangesByRequisition
);

router.get("/:id", RequisitionController.getRequisitionByID);


router.post("/", RequisitionController.insertRequisitions);

router.put("/:requisitionID", RequisitionController.updateRequisitionById);

router.delete("/:requisitionID", RequisitionController.deleteRequisitionById);

module.exports = router;
