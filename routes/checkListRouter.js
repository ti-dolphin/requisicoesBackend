var express = require("express");
var router = express.Router();
var CheckListController = require('../controllers/CheckListController');
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get("/notifications", (req, res ) => { 
    CheckListController.getChecklistNotifications(req, res);
});
router.get('/checklistItems/:id_patrimonio/:id_movimentacao/:id_checklist_movimentacao', (req, res) => {
    CheckListController.getChecklistItems(req, res);
});

router.post('', (req, res) => { 
    CheckListController.updatetChecklist(req, res);
});

router.put('/checklistItems',  (req, res) => {
    CheckListController.updateChecklistItems(req, res);
});

router.put(
  "/checklistItems/file/:id_item_checklist_movimentacao",
  upload.single("file"),
  (req, res) => {
    CheckListController.updateChecklistItemFile(req, res);
  }
);

router.post(
  "/checklistItems/file",
  upload.single("file"),
  (req, res) => {
    CheckListController.createChecklistItemFile(req, res);
  }
);

router.get("/:id_patrimonio", (req, res) => {
  CheckListController.getChecklistByPatrimonyId(req, res);
});

module.exports = router;