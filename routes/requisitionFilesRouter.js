var express = require("express");
var router = express.Router();
const pool = require("../database");
const requisitionFilesController = require("../controllers/requisitionFilesController");
const multerConfig = require("../multer");
const multer = require("multer");
const requisitonController = require("../controllers/requisitionController");

const upload = multer({ storage: multerConfig });

router.post("/:requisitionID", upload.single("file"), async (req, res) => {
        if (req.file){ 
          const response = await requisitionFilesController.createRequisitionFile(
            req.params.requisitionID,
            req.file
          );
          if(response) res.status(200).send(response);
        }
        else res.send(404);
});

router.get("/:requisitionID", async (req, res) => {
        const result = await requisitionFilesController.getRequisitionFiles(
          req.params.requisitionID
        );
        if (result && result.length) return res.status(200).send(result);
        else return res.status(404).send();
});

router.delete('/:fileID', async(req, res) =>  {
  console.log('id da requisição: ', req.params.fileID);
      const result = await requisitionFilesController.deleteRequisitionFile(req.params.fileID);
      if(result) res.status(200).send('success');
      else res.status(404).send('something went wrong');
});

module.exports = router;