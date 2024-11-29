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
module.exports = router;