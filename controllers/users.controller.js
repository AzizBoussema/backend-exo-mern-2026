const User = require("../models/User");

const sendError = (res, status, msg) =>
  res.status(status).json({ errors: [{ msg }] });

// ---------GET ALL USERS--------
exports.getAllUsers = async (req, res) => {
  try {
    const listUsers = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      data: listUsers,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET ONE USER--------
exports.getOneUser = async (req, res) => {
  try {
    const userToGet = await User.findById(req.params.id).select("-password");
    if (!userToGet) {
      return sendError(res, 404, "Cet utilisateur n'existe pas.");
    }

    return res.status(200).json({
      success: true,
      data: userToGet,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------[ADMIN] TOGGLE ACTIVATION USER--------
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, "Utilisateur introuvable.");
    }
    user.isActive = !user.isActive;
    await user.save({ validateModifiedOnly: true });
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------DELETE USER--------
exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) {
      return sendError(res, 404, "L'utilisateur n'existe pas.");
    }

    return res.status(200).json({
      success: true,
      data: userToDelete,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------GET MY PROFILE--------
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return sendError(res, 404, "Utilisateur non trouvé.");
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur.");
  }
};

// ---------UPDATE MY PROFILE--------
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email, firstName, lastName, address, phone, image } = req.body;

    // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return sendError(res, 400, "Cet email est déjà utilisé.");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, firstName, lastName, address, phone, image },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return sendError(res, 404, "Utilisateur non trouvé.");
    }

    // Si c'est un restaurateur, mettre à jour les infos du restaurant aussi
    if (req.user.role === "restaurant") {
      const Restaurant = require("../models/Restaurant");
      const { businessName, restaurantDescription, restaurantPhone,
              restaurantEmail, restaurantAddress, specialties,
              deliveryZones, deliveryTime } = req.body;

      const restaurantUpdate = {};
      if (businessName)           restaurantUpdate.name         = businessName;
      if (businessName)           restaurantUpdate.businessName = businessName;
      if (restaurantDescription)  restaurantUpdate.description  = restaurantDescription;
      if (restaurantPhone)        restaurantUpdate.phone        = restaurantPhone;
      if (restaurantEmail)        restaurantUpdate.email        = restaurantEmail;
      if (restaurantAddress)      restaurantUpdate.address      = restaurantAddress;
      if (deliveryTime)           restaurantUpdate.deliveryTime = deliveryTime;
      if (specialties !== undefined)
        restaurantUpdate.specialties   = Array.isArray(specialties)
          ? specialties
          : specialties.split(",").map((s) => s.trim()).filter(Boolean);
      if (deliveryZones !== undefined)
        restaurantUpdate.deliveryZones = Array.isArray(deliveryZones)
          ? deliveryZones
          : deliveryZones.split(",").map((z) => z.trim()).filter(Boolean);

      if (Object.keys(restaurantUpdate).length > 0) {
        await Restaurant.findOneAndUpdate(
          { ownerId: req.user._id },
          restaurantUpdate,
          { new: true, runValidators: true }
        );
      }
    }

    // Renvoyer l'utilisateur enrichi avec son restaurant (comme /auth/current)
    const Restaurant = require("../models/Restaurant");
    const restaurant = updatedUser.role === "restaurant"
      ? await Restaurant.findOne({ ownerId: updatedUser._id }).lean()
      : null;

    const fullUser = { ...updatedUser.toObject(), restaurant };

    return res.status(200).json({
      success: true,
      data: fullUser,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de la mise à jour.");
  }
};
