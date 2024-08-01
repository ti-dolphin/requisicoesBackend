const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/productsController");

router.get('/', async (req, res) => { 
    await ProductsController.getProductsBySearch(req, res);
});

module.exports = router;
