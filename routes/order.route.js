const express = require("express");
const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const isAuth = require("../middlewares/isAuth");
const isVendor = require("../middlewares/isVendor");

const router = express.Router();

// Routes pour clients
router.post("/", isAuth, createOrder);
router.get("/my-orders", isAuth, getMyOrders);

// Routes pour restaurateurs
router.get("/vendor/orders", isAuth, isVendor, getVendorOrders);
router.put("/:id/status", isAuth, isVendor, updateOrderStatus);

module.exports = router;