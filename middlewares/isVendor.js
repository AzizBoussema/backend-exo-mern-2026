const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isVendor = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(400).json({ errors: [{ msg: "Pas de token" }] });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const foundUser = await User.findOne({ _id: decode.id });
    if (!foundUser) {
      return res.status(404).json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    }

    if (foundUser.role !== "restaurant") {
      return res.status(403).json({ errors: [{ msg: "Accès réservé aux restaurateurs" }] });
    }

    req.user = foundUser;
    next();
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Impossible de vérifier" }], error });
  }
};

module.exports = isVendor;