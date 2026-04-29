const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du restaurant est requis"],
      trim: true,
      minlength: [2, "Le nom doit avoir au moins 2 caractères"],
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [100, "Le nom commercial ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x280?text=Restaurant",
      trim: true,
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Veuillez fournir un email valide",
      ],
    },
    registrationRNE: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      required: [true, "Le numéro RNE est requis"],
    },
    specialties: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((specialty) => specialty.length > 0);
        },
        message: "Les spécialités ne peuvent pas être vides",
      },
    },
    deliveryZones: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((zone) => zone.length > 0);
        },
        message: "Les zones de livraison ne peuvent pas être vides",
      },
    },
    rating: {
      type: Number,
      min: [0, "La note ne peut pas être inférieure à 0"],
      max: [5, "La note ne peut pas dépasser 5"],
      default: 0,
    },
    deliveryTime: {
      type: String,
      default: "30-45 min",
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Le propriétaire est requis"],
      unique: true,
      index: true,
      validate: {
        validator: async function (v) {
          const User = mongoose.model("user");
          const user = await User.findById(v);
          return user && user.role === "restaurant";
        },
        message: "Le propriétaire doit être un utilisateur avec le rôle 'restaurant'",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageDeliveryTime: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Indexes pour performance
restaurantSchema.index({ isActive: 1, createdAt: -1 });
restaurantSchema.index({ specialties: 1 });
restaurantSchema.index({ deliveryZones: 1 });

// Middleware pour vérifier l'unicité du RNE
restaurantSchema.pre("findByIdAndUpdate", async function (next) {
  if (this._update.registrationRNE) {
    const existing = await mongoose.model("restaurant").findOne({
      registrationRNE: this._update.registrationRNE,
      _id: { $ne: this._id },
    });

    if (existing) {
      throw new Error("Ce numéro RNE est déjà utilisé");
    }
  }
  next();
});

module.exports = mongoose.model("restaurant", restaurantSchema);
