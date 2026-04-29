const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper pour envoyer des erreurs formatées
const sendError = (res, status, msg) =>
  res.status(status).json({
    success: false,
    errors: [{ msg }]
  });

// Helper pour envoyer des succès formatés
const sendSuccess = (res, status, data) =>
  res.status(status).json({
    success: true,
    data
  });

// Helper pour construire l'utilisateur avec ses données associées
const buildAuthUser = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    return null;
  }

  const restaurant = user.role === "restaurant"
    ? await Restaurant.findOne({ ownerId: user._id }).lean()
    : null;

  return {
    ...user,
    restaurant,
  };
};

// ---------REGISTER--------
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      role,
      firstName,
      lastName,
      address,
      phone,
      businessName,
      registrationRNE,
      specialties,
      deliveryZones,
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return sendError(res, 400, "Utilisateur existe deja.");
    }

    // Crypter le mot de passe
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      image,
      role: role || "client",
      firstName,
      lastName,
      address,
      phone,
    });

    await newUser.save();

    // Si c'est un restaurateur, créer un restaurant
    if (newUser.role === "restaurant") {
      await Restaurant.create({
        ownerId: newUser._id,
        name: businessName || name,
        businessName: businessName || name,
        description: Array.isArray(specialties) && specialties.length
          ? `Specialites: ${specialties.join(", ")}`
          : "",
        image,
        address,
        phone,
        email,
        registrationRNE,
        specialties: specialties || [],
        deliveryZones: deliveryZones || [],
      });
    }

    // Générer le JWT
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Récupérer l'utilisateur avec ses données enrichies
    const user = await buildAuthUser(newUser._id);

    return sendSuccess(res, 201, {
      message: "Utilisateur cree avec succes.",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, 500, "Echec d'enregistrement.");
  }
};

// ---------LOGIN--------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur par email en incluant le mot de passe
    const foundUser = await User.findOne({ email }).select("+password");
    if (!foundUser) {
      return sendError(res, 400, "Erreur d'authentification.");
    }

    // Vérifier le mot de passe
    const checkPassword = await bcrypt.compare(password, foundUser.password);
    if (!checkPassword) {
      return sendError(res, 400, "Erreur d'authentification.");
    }

    // Générer le JWT
    const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Récupérer l'utilisateur avec ses données enrichies
    const user = await buildAuthUser(foundUser._id);

    return sendSuccess(res, 200, {
      message: "Succes de connexion.",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Impossible de se connecter.");
  }
};

// ---------CURRENT USER--------
exports.current = async (req, res) => {
  try {
    const user = await buildAuthUser(req.user._id);
    if (!user) {
      return sendError(res, 404, "Utilisateur non trouve.");
    }

    return sendSuccess(res, 200, user);
  } catch (error) {
    console.error("Current user error:", error);
    return sendError(res, 500, "Impossible de recuperer l'utilisateur.");
  }
};
