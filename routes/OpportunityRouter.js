const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../multer");
const upload = multer({ storage: multerConfig });
const OpportunityController = require('../controllers/OpportunityController');
router.get('/',  (req, res) => { 
    console.log('GET')
    OpportunityController.getOpportunities(req, res);
});

router.post('/', (req, res) => {
    console.log('POST');
    OpportunityController.createOpportunity(req, res);
});

router.get('/saler', (req, res) => {
    OpportunityController.getSalers(req, res);
})
router.get('/status', (req, res) => {
    OpportunityController.getStatusList(req, res);
});

router.get('/client', (req, res) => {
    OpportunityController.getClients(req, res);
})
module.exports = router;