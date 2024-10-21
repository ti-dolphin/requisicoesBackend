var express = require("express");
var router = express.Router();
var CheckListController = require('../controllers/CheckListController');
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get("/notifications", (req, res ) => { 
    console.log("getChecklistNotifications");
    CheckListController.getChecklistNotifications(req, res);
});
router.get('/checklistItems/:id_patrimonio/:id_movimentacao/:id_checklist_movimentacao', (req, res) => {
    CheckListController.getChecklistItemsMap(req, res);
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
    console.log('POST ITEMFILE')
    CheckListController.createChecklistItemFile(req, res);
  }
);

router.get('/:id_movimentacao', (req, res) => {
    CheckListController.getChecklistsByMovementationID(req, res);
});

module.exports = router;