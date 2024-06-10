var express = require('express');
var router = express.Router();
const pool = require('../database');

/* GET home page. */
router.get('/', async function(req, res, next) {
    res.send('Hello World');
});

module.exports = router;
