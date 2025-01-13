const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../multer");
const OpportunityController = require('../controllers/OpportunityController');
const upload = multer({ storage: multerConfig });
router.get('/',  (req, res) => { 
    console.log('GET')
    OpportunityController.getOpportunities(req, res);
});

router.put("/update", async (req, res) => {
  console.log("PUT");
  await OpportunityController.updateOpportunity(req, res);
});

router.post('/create', async (req, res) => {
    console.log('POST');
    await OpportunityController.createOpportunity(req, res);
});


router.post('/files',  upload.array("files"), (req, res) => {
    console.log('POST FILES')
    OpportunityController.uploadFiles(req, res);
});
// get files

router.get('/files',  (req, res) => {
    OpportunityController.getOpportunityFiles(req, res);
});

router.get('/saler', (req, res) => {
    OpportunityController.getSalers(req, res);
})
router.get('/status', (req, res) => {
    OpportunityController.getStatusList(req, res);
});

router.get('/client', (req, res) => {
    OpportunityController.getClients(req, res);
});

 router.get("/:oppId", (req, res) => {
   console.log("GET by ID");
   //log req params
   console.log(req.params);
   //call controller method to get by opp id
   OpportunityController.getOpportunityById(req, res);
 });
module.exports = router;