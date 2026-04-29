const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
    // Récupérer le token du header authorization
    const token = req.headers["authorization"];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "Pas de token fourni" }]
      });
    }

    // Vérifier et décoder le token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    
    // Chercher l'utilisateur correspondant
    const foundUser = await User.findById(decode.id);
    
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ msg: "Utilisateur non trouvé" }]
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = foundUser;
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      errors: [{ msg: "Token invalide ou expiré" }]
    });
  }
};

module.exports = isAuth;
