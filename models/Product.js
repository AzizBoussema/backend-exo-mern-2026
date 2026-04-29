const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
      minlength: [2, "Le nom doit avoir au moins 2 caractères"],
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    price: {
      type: Number,
      required: [true, "Le prix est requis"],
      min: [0, "Le prix ne peut pas être négatif"],
      max: [10000, "Le prix ne peut pas dépasser 10000"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x280?text=Produit",
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, "La catégorie ne peut pas dépasser 50 caractères"],
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: [true, "Le restaurant est requis"],
      index: true,
      validate: {
        validator: async function (v) {
          const Restaurant = mongoose.model("restaurant");
          return await Restaurant.findById(v);
        },
        message: "Le restaurant spécifié n'existe pas",
      },
    },
    available: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["published", "unpublished"],
        message: "Le statut doit être 'published' ou 'unpublished'",
      },
      default: "published",
      index: true,
    },
    calories: {
      type: Number,
      min: [0, "Les calories ne peuvent pas être négatives"],
    },
    ingredients: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((ingredient) => ingredient.length > 0);
        },
        message: "Les ingrédients ne peuvent pas être vides",
      },
    },
    allergens: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((allergen) => allergen.length > 0);
        },
        message: "Les allergènes ne peuvent pas être vides",
      },
    },
    stock: {
      type: Number,
      default: null,
      min: [0, "Le stock ne peut pas être négatif"],
    },
    rating: {
      type: Number,
      min: [0, "La note ne peut pas être inférieure à 0"],
      max: [5, "La note ne peut pas dépasser 5"],
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Indexes composés pour performance
productSchema.index({ restaurantId: 1, status: 1, available: 1 });
productSchema.index({ restaurantId: 1, category: 1 });
productSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model("product", productSchema);
