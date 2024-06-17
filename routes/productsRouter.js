var express = require("express");
var router = express.Router();
const pool = require("../database");
const productsController = require('../controllers/productsController');

router.get('/',  async ( req, res ) => { 
    const { limit, offSet } = req.query;
    const [ result ]  = await productsController.getAllProducts(limit, offSet);
    if (result && result.length) {
      res.status(200).send(result);
    } else res.status(404).send("Ops, algo deu errado!");
});
module.exports = router;