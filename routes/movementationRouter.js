var express = require("express");
var router = express.Router();
const MovementationController = require('../controllers/MovementationController');
const multerConfig = require("../multer");
const multer = require("multer");
const upload = multer({ storage: multerConfig });

router.get('/:patrimonyId', async(req, res, next) => { 
    
    await MovementationController.getMovementationsByPatrimonyId(req, res);
});

//MOVEMETATIONFILES ROUTES

router.post("/files/:movementationId", upload.single("file"), async(req, res, next) => { 
     MovementationController.createMovementationFile(req, res);
});
router.get('/files/:movementationId',  (req, res, next)=> { 
     MovementationController.getMovementationFiles(req, res);
});

router.delete("/files/:filename/:movementationFileId", (req, res) =>  {
     MovementationController.deleteMovementationFile(req, res)
});
router.post('', (req, res, next) => { 
     MovementationController.createMovementation(req, res);
});
router.put('/:movementationId' , (req, res, next) => { 
     MovementationController.updateMovementation(req, res)
} );
router.put('/accept/:movementationId' , (req, res, next) => {
     MovementationController.acceptMovementation(req, res);
});
router.delete("/:patrimonyId/:movementationId",  (req, res, next) => {
   MovementationController.deleteMovementation(req, res);
});




module.exports = router;