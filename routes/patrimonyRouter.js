var express = require("express");
var router = express.Router();
const PatrimonyController = require('../controllers/PatrimonyController');
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get('', (req, res, next ) => { 
    console.log('get patrimony info');
     PatrimonyController.getPatrimonyInfo(req, res);
});

router.get('/:patrimonyId', (req, res, next) => { 
     PatrimonyController.getSinglePatrimonyInfo(req, res);
});

router.put("/:patrimonyId",  (req, res, next) => {
   console.log('PUT PATRIMONIO')
   PatrimonyController.updatePatrimony(req, res);
});

router.post('', (req, res, next) => {  
     PatrimonyController.createPatrimony(req, res);
});

router.post("/files/:patrimonyId",upload.single("file"), (req, res, next) => {
     console.log('post file: ', req.params.patrimonyId)
  PatrimonyController.createPatrimonyFile(req, res);
});

router.delete("/files/:patrimonyFileId", upload.single("file"), (req, res, next) => {
  PatrimonyController.deletePatrimonyFile(req, res);
});

router.get('/files/:patrimonyId', (req, res, next) =>  { 
     PatrimonyController.getPatrimonyFiles(req, res);
});
module.exports = router;
