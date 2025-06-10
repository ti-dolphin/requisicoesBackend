const ProductService = require("../services/ProductService");

class ProductsController {
  static async getProductsBySearch(req, res) {
    const { search, typeId } = req.query;
    try {
      const products = await ProductService.getProductsBySearch(search, typeId);
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

  static updateProducts = async (req, res ) =>  {
    console.log("updateProducts");
    try{ 
      const data = req.body;
      const result = await ProductService.updateProducts(data);
      return res.status(200).send(result);
    }catch(e){ 
      console.log("Erro ao atualizar produtos: ", e);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = ProductsController;
