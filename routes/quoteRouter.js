
var express = require("express");
var router = express.Router();
const QuoteController = require('../controllers/QuoteController');

router.get('/', (req, res) => { 
    QuoteController.getQuotes(req, res);
});

router.get('/quoteList/:requisitionId', (req,res)=> { 
    QuoteController.getQuotesByRequisitionId(req, res);
});

router.get('/classification', (req, res) => {
    console.log('CLASSIFICATIONS')
    QuoteController.getFiscalClassifications(req, res);
});

router.get('/shipment-type', (req, res)=> {
     QuoteController.getShipmentTypes(req, res)
})

router.get('/:quoteId', (req, res) =>  {
    QuoteController.getQuoteById(req, res);
});

router.post('/', (req, res) => {
    console.log('POST')
    QuoteController.create(req, res);
});

router.put('/:quoteId', (req, res) => { 
    QuoteController.update(req, res);
});
router.put('/:quoteId/items', (req, res) => { 
    QuoteController.updateItems(req, res);
});


module.exports = router;
