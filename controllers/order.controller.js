const Order = require("../models/Order");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");

const sendError = (res, status, msg) =>
  res.status(status).json({ errors: [{ msg }] });

// ---------CREATE ORDER--------
exports.createOrder = async (req, res) => {
  try {
    const { products, deliveryAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return sendError(res, 400, "Aucun produit dans la commande.");
    }

    let totalAmount = 0;
    let restaurantId = null;
    const normalizedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId).populate("restaurantId");
      if (!product || product.status !== "published" || !product.available) {
        return sendError(res, 400, `Produit ${item.productId} non disponible.`);
      }

      if (!restaurantId) {
        restaurantId = product.restaurantId._id;
      } else if (restaurantId.toString() !== product.restaurantId._id.toString()) {
        return sendError(res, 400, "Tous les produits doivent etre du meme restaurant.");
      }

      totalAmount += product.price * item.quantity;
      normalizedProducts.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const newOrder = new Order({
      userId: req.user._id,
      restaurantId,
      products: normalizedProducts,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cash",
    });

    await newOrder.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "name email")
      .populate("restaurantId", "name businessName image")
      .populate("products.productId", "name price image");

    return res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    return sendError(res, 500, error.message || "Erreur lors de la creation de la commande.");
  }
};

// ---------GET MY ORDERS--------
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("restaurantId", "name businessName image")
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET VENDOR ORDERS--------
exports.getVendorOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const orders = await Order.find({ restaurantId: restaurant._id })
      .populate("userId", "name email phone address")
      .populate("restaurantId", "name businessName image")
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------UPDATE ORDER STATUS--------
exports.updateOrderStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return sendError(res, 404, "Restaurant introuvable pour ce vendeur.");
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return sendError(res, 404, "Commande non trouvee.");
    }

    if (order.restaurantId.toString() !== restaurant._id.toString()) {
      return sendError(res, 403, "Vous ne pouvez modifier que les commandes de votre restaurant.");
    }

    if (req.body.status === "cancelled" && !req.body.cancellationReason) {
      return sendError(res, 400, "La raison d'annulation est requise.");
    }

    const updateData = { status: req.body.status };
    if (req.body.status === "cancelled") {
      updateData.cancellationReason = req.body.cancellationReason;
    }
    if (req.body.status === "delivered") {
      updateData.actualDeliveryTime = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("userId", "name email phone address")
      .populate("restaurantId", "name businessName image")
      .populate("products.productId", "name price image");

    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur lors de la mise a jour.");
  }
};
