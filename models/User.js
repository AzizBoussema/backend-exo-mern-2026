const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      minlength: [2, "Le nom doit avoir au moins 2 caractères"],
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Veuillez fournir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [8, "Le mot de passe doit avoir au moins 8 caractères"],
      select: false,
    },
    image: {
      type: String,
      default: "../assets/picture.png",
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    role: {
      type: String,
      enum: {
        values: ["client", "restaurant"],
        message: "Le rôle doit être 'client' ou 'restaurant'",
      },
      default: "client",
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "L'adresse ne peut pas dépasser 200 caractères"],
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[0-9+\-\s()]{8,}$/,
        "Veuillez fournir un numéro de téléphone valide",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index composé pour recherche rapide
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Middleware pour éviter les doublons
userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    return next();
  }

  const existingUser = await mongoose.model("user").findOne({
    email: this.email,
    _id: { $ne: this._id },
  });

  if (existingUser) {
    throw new Error("Cet email est déjà utilisé");
  }

  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
