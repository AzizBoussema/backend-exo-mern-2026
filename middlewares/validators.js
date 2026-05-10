const { check, validationResult } = require("express-validator");

// Validations pour l'enregistrement
exports.registerValidation = () => [
  check("name", "Nom est obligatoire").notEmpty().trim(),
  check("email", "Entrer un email valide").isEmail().normalizeEmail(),
  check("password", "Longueur du mot de passe doit être entre 8 et 50 caractères").isLength({ min: 8, max: 50 }),
  check("role", "Rôle doit être 'client' ou 'restaurant'").optional().isIn(["client", "restaurant"]),
];

// Validations pour la connexion
// Note: pas de contrainte de longueur sur le login pour ne pas bloquer
// les utilisateurs existants — on vérifie seulement que le champ n'est pas vide.
exports.loginValidation = () => [
  check("email", "Entrer un email valide").isEmail().normalizeEmail(),
  check("password", "Le mot de passe est requis").notEmpty(),
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
