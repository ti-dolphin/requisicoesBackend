var express = require("express");
var router = express.Router();
const QuoteController = require("../controllers/QuoteController");
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get("/", (req, res) => {
  QuoteController.getQuotes(req, res);
});

router.get("/quoteList/:requisitionId", (req, res) => {
  QuoteController.getQuotesByRequisitionId(req, res);
});

router.get("/classification", (req, res) => {
  console.log("CLASSIFICATIONS");
  QuoteController.getFiscalClassifications(req, res);
});

router.get("/shipment-type", (req, res) => {
  QuoteController.getShipmentTypes(req, res);
});

router.get("/file/:quoteId", QuoteController.getFilesByQuoteId);

router.post(
  "/file/:quoteId",
  upload.single("file"),
  QuoteController.createQuoteFile
);

router.post(
  "/file/:quoteId",
  upload.single("file"),
  QuoteController.createQuoteFile
);
router.delete("/file/:quoteId/:fileId", QuoteController.deleteQuoteFileById);

router.get("/:quoteId", (req, res) => {
  console.log("getQuote");
  QuoteController.getQuoteById(req, res);
});

router.post("/", (req, res) => {
  console.log("POST");
  QuoteController.create(req, res);
});

router.put("/:quoteId", (req, res) => {
  QuoteController.update(req, res);
});
router.put("/:quoteId/items", (req, res) => {
  QuoteController.updateItems(req, res);
});

module.exports = router;
