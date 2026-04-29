const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const isVendor = require("../middlewares/isVendor");

router.post("/", isAuth, isVendor, productController.addProduct);
router.get("/vendor/my-products", isAuth, isVendor, productController.getMyProducts);
router.get("/restaurant/:restaurantId", productController.getProductsByRestaurant);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", isAuth, isVendor, productController.updateProduct);
router.delete("/:id", isAuth, isVendor, productController.deleteProduct);

module.exports = router;
