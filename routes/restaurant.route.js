const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const isAuth = require("../middlewares/isAuth");
const isVendor = require("../middlewares/isVendor");

router.post("/", isAuth, isVendor, restaurantController.addRestaurant);
router.get("/my-restaurant", isAuth, isVendor, restaurantController.getMyRestaurant);
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
