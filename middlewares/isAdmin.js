const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
      const token = req.headers["authorization"];
      
    // console.log(req.headers["authorization"]);
    if (!token) {
      return res.status(400).json({ msg: "Pas de token" });
    }

    //user qui correspond a ce token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decode)
    const foundUser = await User.findOne({ _id: decode.id });
    if (!foundUser) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }
    if (!foundUser.isAdmin) {
      return res.status(403).json({ msg: "Vous n'avez pas le droit " });
    }
    req.user = foundUser;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Impossible de vérifier", error });
  }
};

module.exports = isAdmin;
