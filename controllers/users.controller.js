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

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return sendError(res, 500, "Erreur serveur lors de la mise à jour.");
  }
};
