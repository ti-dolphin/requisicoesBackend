var express = require("express");
var router = express.Router();
const multerConfig = require("../multer");
const multer = require("multer");
const ItemFileController = require("../controllers/itemFileController");

const upload = multer({ storage: multerConfig });

// POST /item/:itemID
router.post("/:itemID", upload.single("file"), (req, res) => {
  ItemFileController.createItemFile(req, res);
});

// POST /item/link/:itemID
router.post("/link/:itemID", (req, res) => {
  ItemFileController.createItemFileFromLink(req, res);
});

// GET /item/:itemID
router.get("/:itemID", (req, res) => {
  ItemFileController.getItemFilesByFileId(req, res);
});

// DELETE /item/:id
router.delete("/:id", (req, res) => {
  ItemFileController.deleteItemFile(req, res);
});

module.exports = router;
