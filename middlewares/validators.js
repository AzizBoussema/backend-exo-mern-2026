const { check, validationResult } = require("express-validator");

// Validations pour l'enregistrement
exports.registerValidation = () => [
  check("name", "Nom est obligatoire").notEmpty().trim(),
  check("email", "Entrer un email valide").isEmail().normalizeEmail(),
  check("password", "Longueur du mot de passe doit être entre 5 et 15 caractères").isLength({ min: 5, max: 15 }),
  check("role", "Rôle doit être 'client' ou 'restaurant'").optional().isIn(["client", "restaurant"]),
];

// Validations pour la connexion
exports.loginValidation = () => [
  check("email", "Entrer un email valide").isEmail().normalizeEmail(),
  check("password", "Longueur du mot de passe doit être entre 5 et 15 caractères").isLength({ min: 5, max: 15 }),
];

// Middleware pour vérifier les erreurs de validation
exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};
