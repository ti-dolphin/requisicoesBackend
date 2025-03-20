
var express = require("express");
var router = express.Router();
const QuoteController = require('../controllers/QuoteController');

router.get('/', (req, res) => { 
    QuoteController.getQuotes(req, res);
});

router.get('/:quoteId', (req, res) =>  {
    QuoteController.getQuoteById(req, res);
})

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
