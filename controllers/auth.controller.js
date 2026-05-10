const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
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
      image:     image     || undefined,
      role:      role      || "client",
      firstName: firstName || undefined,
      lastName:  lastName  || undefined,
      address:   address   || undefined,
      phone:     phone     || undefined,
    });

    await newUser.save();

    // Si c'est un restaurateur, créer un restaurant
    if (newUser.role === "restaurant") {
      await Restaurant.create({
        ownerId:       newUser._id,
        name:          businessName || name,
        businessName:  businessName || name,
        description:   Array.isArray(specialties) && specialties.length
          ? `Specialites: ${specialties.join(", ")}`
          : "",
        image:         image    || undefined,
        address:       address  || undefined,
        phone:         phone    || undefined,
        email,
        registrationRNE,
        specialties:   specialties  || [],
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
    // Log complet côté serveur pour faciliter le débogage
    console.error("[REGISTER ERROR]", error.name, "|", error.message, "|", "code:", error.code);

    // Erreurs de validation Mongoose (champ requis, match, minlength…)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => ({ msg: e.message }));
      return res.status(400).json({ success: false, errors: messages });
    }

    // Erreur clé dupliquée MongoDB (email ou RNE déjà utilisé)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      const label = field === "email" ? "cet email" : field === "registrationRNE" ? "ce numéro RNE" : "ces informations";
      return res.status(400).json({
        success: false,
        errors: [{ msg: `Un compte avec ${label} existe déjà.` }],
      });
    }

    // En développement : renvoyer le détail de l'erreur pour débogage
    const isDev = process.env.NODE_ENV !== "production";
    return res.status(500).json({
      success: false,
      errors: [{
        msg: isDev
          ? `[DEV ${error.name}] ${error.message}`
          : "Echec d'enregistrement.",
      }],
    });
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
