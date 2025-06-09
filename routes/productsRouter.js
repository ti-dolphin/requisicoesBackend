const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/productsController");

router.get('/',  (req, res) => { 
     ProductsController.getProductsBySearch(req, res);
});

router.put("/updateMany", ProductsController.updateProducts);
   


module.exports = router;
