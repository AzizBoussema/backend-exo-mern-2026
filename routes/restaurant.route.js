const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const isAuth = require("../middlewares/isAuth");
const isVendor = require("../middlewares/isVendor");
const isAdmin = require("../middlewares/isAdmin");

// Routes vendeur
router.post("/", isAuth, isVendor, restaurantController.addRestaurant);
router.get("/my-restaurant", isAuth, isVendor, restaurantController.getMyRestaurant);

// Routes admin (statiques avant /:id)
router.get("/admin/all", isAdmin, restaurantController.adminGetAllRestaurants);
router.put("/admin/:id/validate", isAdmin, restaurantController.validateRestaurant);
router.put("/admin/:id/reject", isAdmin, restaurantController.rejectRestaurant);
router.delete("/admin/:id", isAdmin, restaurantController.adminDeleteRestaurant);

// Routes publiques
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

module.exports = router;
