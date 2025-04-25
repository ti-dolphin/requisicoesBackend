var express = require("express");
var router = express.Router();
const multerConfig = require("../multer");
const multer = require("multer");
const RequisitionFilesController = require("../controllers/requisitionFilesController");

const upload = multer({ storage: multerConfig });

router.post(
  "/:requisitionID",
  upload.single("file"),
  RequisitionFilesController.createRequisitionFile
);

router.post("/link/:requisitionID", RequisitionFilesController.createRequisitionFileFromLink);

router.get("/:requisitionID", RequisitionFilesController.getRequisitionFiles);

router.delete("/:filename/:fileID", RequisitionFilesController.deleteRequisitionFile);



module.exports = router;
