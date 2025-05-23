var express = require("express");
var router = express.Router();
const PatrimonyController = require('../controllers/PatrimonyController');
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get('', (req, res, next ) => { 
    
     PatrimonyController.getPatrimonyInfo(req, res);
});

router.get('/types', (req, res, next) => { 
     PatrimonyController.getPatrimonyType(req, res);
});
router.get('/inactive', (req, res, next) => { 
     PatrimonyController.getInactivePatrymonyInfo(req, res)
});

router.get('/:patrimonyId', (req, res, next) => { 
     PatrimonyController.getSinglePatrimonyInfo(req, res);
});

router.get("/files/:patrimonyId", (req, res, next) => {
  PatrimonyController.getPatrimonyFiles(req, res);
});

router.get("/responsable/:patrimonyId", (req, res, next) => {
  PatrimonyController.getPatrimonyResponsable(req, res);
});


router.put("/:patrimonyId",  (req, res, next) => {
  
   PatrimonyController.updatePatrimony(req, res);
});


router.put('/', (req, res, next) => { 
     PatrimonyController.updatePatrimonies(req, res);
});


router.post('', (req, res, next) => {  
     PatrimonyController.createPatrimony(req, res);
});

router.post("/files/:patrimonyId", upload.single("file"), (req, res, next) => {
  PatrimonyController.createPatrimonyFile(req, res);
});

router.delete("/files/:filename/:patrimonyFileId", (req, res, next) => {
  PatrimonyController.deletePatrimonyFile(req, res);
});

router.delete("/:patrimonyId", (req, res, next) => {
  PatrimonyController.deletePatrimony(req, res);
});

module.exports = router;
