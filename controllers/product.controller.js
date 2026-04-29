const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

const sendError = (res, status, msg) =>
  res.status(status).json({ errors: [{ msg }] });

const getVendorRestaurant = async (userId) => Restaurant.findOne({ ownerId: userId });

// ---------ADD PRODUCT--------
exports.addProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const restaurant = await getVendorRestaurant(req.user._id);
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const newProduct = new Product({
      ...req.body,
      restaurantId: restaurant._id,
    });

    await newProduct.save();

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "restaurantId",
      "name businessName image rating deliveryTime address"
    );

    return res.status(201).json({
      success: true,
      data: populatedProduct,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de l'ajout du produit.");
  }
};

// ---------GET ALL PRODUCTS--------
exports.getAllProducts = async (req, res) => {
  try {
    const filters = {
      status: "published",
      available: true,
    };

    if (req.query.restaurantId) {
      filters.restaurantId = req.query.restaurantId;
    }

    const products = await Product.find(filters)
      .populate("restaurantId", "name businessName image rating deliveryTime address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de la recuperation.");
  }
};

// ---------GET MY PRODUCTS--------
exports.getMyProducts = async (req, res) => {
  try {
    const restaurant = await getVendorRestaurant(req.user._id);
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const products = await Product.find({ restaurantId: restaurant._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET PRODUCTS BY RESTAURANT--------
exports.getProductsByRestaurant = async (req, res) => {
  try {
    const products = await Product.find({
      restaurantId: req.params.restaurantId,
      status: "published",
      available: true,
    }).populate("restaurantId", "name businessName image rating deliveryTime address");

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET PRODUCT BY ID--------
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "restaurantId",
      "name businessName image rating deliveryTime address"
    );
    if (!product) {
      return sendError(res, 404, "Produit introuvable.");
    }

    // Si l'utilisateur est un vendeur, vérifier qu'il possède ce produit
    if (req.user && req.user.role === "restaurant") {
      const restaurant = await getVendorRestaurant(req.user._id);
      if (!restaurant || product.restaurantId.toString() !== restaurant._id.toString()) {
        return sendError(res, 403, "Vous ne pouvez accéder qu'à vos propres produits.");
      }
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------UPDATE PRODUCT--------
exports.updateProduct = async (req, res) => {
  try {
    const restaurant = await getVendorRestaurant(req.user._id);
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Produit introuvable.");
    }

    if (product.restaurantId.toString() !== restaurant._id.toString()) {
      return sendError(res, 403, "Vous ne pouvez modifier que vos propres produits.");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, restaurantId: restaurant._id },
      { new: true }
    ).populate("restaurantId", "name businessName image rating deliveryTime address");

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur lors de la modification.");
  }
};

// ---------DELETE PRODUCT--------
exports.deleteProduct = async (req, res) => {
  try {
    const restaurant = await getVendorRestaurant(req.user._id);
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Produit introuvable.");
    }

    if (product.restaurantId.toString() !== restaurant._id.toString()) {
      return sendError(res, 403, "Vous ne pouvez supprimer que vos propres produits.");
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: { _id: req.params.id },
    });
  } catch (error) {
    return sendError(res, 500, "Erreur lors de la suppression.");
  }
};
