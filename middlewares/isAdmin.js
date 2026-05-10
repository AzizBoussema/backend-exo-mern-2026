const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ success: false, errors: [{ msg: "Pas de token fourni" }] });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const foundUser = await User.findById(decode.id);

    if (!foundUser) {
      return res.status(404).json({ success: false, errors: [{ msg: "Utilisateur non trouvé" }] });
    }
    if (!foundUser.isAdmin) {
      return res.status(403).json({ success: false, errors: [{ msg: "Accès réservé aux administrateurs" }] });
    }

    req.user = foundUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, errors: [{ msg: "Token invalide ou expiré" }] });
  }
};

module.exports = isAdmin;
