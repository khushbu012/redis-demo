const express = require("express");
const productController = require("../controllers/productController");
const { requireSignIn } = require("../middleware/authentication");
const { cacheMiddleware } = require("../middleware/redisMiddleware");
const router = express.Router();

router.post("/create-product", requireSignIn, productController.createProduct);
router.get(
  "/get-allproducts",
  requireSignIn,
  cacheMiddleware("allProducts"),
  productController.getAllProducts
);
router.get(
  "/get-productbyId/:id",
  requireSignIn,
  cacheMiddleware("productById"),
  productController.getProductById
);
router.put(
  "/update-product/:id",
  requireSignIn,
  productController.updateProduct
);
router.delete(
  "/delete-product/:id",
  requireSignIn,
  productController.deleteProduct
);

module.exports = router;
