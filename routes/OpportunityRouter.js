const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../multer");
const OpportunityController = require('../controllers/OpportunityController');
const upload = multer({ storage: multerConfig });
router.get('/', (req, res) => {
    console.log('GET')
    OpportunityController.getOpportunities(req, res);
});

router.put("/update", async (req, res) => {
    await OpportunityController.updateOpportunity(req, res);
});

router.post('/create', async (req, res) => {

    await OpportunityController.createOpportunity(req, res);
});


router.post('/files', upload.array("files"), (req, res) => {

    OpportunityController.uploadFiles(req, res);
});
// get files

router.get('/files', (req, res) => {
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
    OpportunityController.getOpportunityById(req, res);
});
module.exports = router;