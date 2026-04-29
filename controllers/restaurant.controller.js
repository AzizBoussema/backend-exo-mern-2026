const { validationResult } = require("express-validator");
const Restaurant = require("../models/Restaurant");

const sendError = (res, status, msg) =>
  res.status(status).json({ errors: [{ msg }] });

// ---------ADD RESTAURANT--------
exports.addRestaurant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingRestaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (existingRestaurant) {
      return sendError(res, 400, "Un restaurant existe deja pour ce compte.");
    }

    const newRestaurant = new Restaurant({
      ...req.body,
      ownerId: req.user._id,
      name: req.body.businessName || req.body.name,
      businessName: req.body.businessName || req.body.name,
      email: req.body.email || req.user.email,
    });

    await newRestaurant.save();

    return res.status(201).json({
      success: true,
      data: newRestaurant,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de l'ajout du restaurant.");
  }
};

// ---------GET ALL RESTAURANTS--------
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de la recuperation.");
  }
};

// ---------GET MY RESTAURANT--------
exports.getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable.");
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET RESTAURANT BY ID--------
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable.");
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};
