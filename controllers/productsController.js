const ProductService = require("../services/ProductService");

class ProductsController {
  static async getProductsBySearch(req, res) {
    const { search } = req.query;
    try {
      const products = await ProductService.getProductsBySearch(search);
      if (products) {
        res.status(200).send(products);
      } else {
        res.status(404).send("Products not found");
      }
    } catch (e) {
      console.log("Error in getProductsBySearch: ", e);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = ProductsController;
