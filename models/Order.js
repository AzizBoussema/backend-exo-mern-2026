const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "L'utilisateur est requis"],
      index: true,
      validate: {
        validator: async function (v) {
          const User = mongoose.model("user");
          return await User.findById(v);
        },
        message: "L'utilisateur spécifié n'existe pas",
      },
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
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          name: {
            type: String,
            required: [true, "Le nom du produit est requis"],
            trim: true,
          },
          price: {
            type: Number,
            required: [true, "Le prix est requis"],
            min: [0, "Le prix ne peut pas être négatif"],
          },
          quantity: {
            type: Number,
            required: [true, "La quantité est requise"],
            min: [1, "La quantité doit être au moins 1"],
          },
          image: {
            type: String,
            trim: true,
          },
        },
      ],
      required: [true, "Au moins un produit est requis"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "La commande doit contenir au moins un produit",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Le montant total est requis"],
      min: [0, "Le montant ne peut pas être négatif"],
    },
    deliveryAddress: {
      type: String,
      required: [true, "L'adresse de livraison est requise"],
      trim: true,
      maxlength: [200, "L'adresse ne peut pas dépasser 200 caractères"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["cash", "card", "online"],
        message: "La méthode de paiement doit être 'cash', 'card' ou 'online'",
      },
      default: "cash",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          "pending",
          "confirmed",
          "preparing",
          "ready",
          "delivered",
          "cancelled",
        ],
        message:
          "Le statut doit être l'une des valeurs: pending, confirmed, preparing, ready, delivered, cancelled",
      },
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Les notes ne peuvent pas dépasser 300 caractères"],
      default: "",
    },
    estimatedDeliveryTime: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Le temps de livraison doit être dans le futur",
      },
    },
    actualDeliveryTime: {
      type: Date,
    },
    rating: {
      type: Number,
      min: [0, "La note ne peut pas être inférieure à 0"],
      max: [5, "La note ne peut pas dépasser 5"],
    },
    review: {
      type: String,
      maxlength: [500, "L'avis ne peut pas dépasser 500 caractères"],
    },
    cancellationReason: {
      type: String,
      maxlength: [200, "La raison ne peut pas dépasser 200 caractères"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "La réduction ne peut pas être négative"],
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Les frais de livraison ne peuvent pas être négatifs"],
    },
  },
  { timestamps: true }
);

// Indexes pour performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

// Middleware pour calculer le montant automatiquement
orderSchema.pre("save", function () {
  if (
    this.isModified("products") ||
    this.isModified("discount") ||
    this.isModified("deliveryFee")
  ) {
    const productsTotal = this.products.reduce(
      (acc, prod) => acc + prod.price * prod.quantity,
      0
    );
    this.totalAmount = productsTotal - this.discount + this.deliveryFee;
  }
});

// Middleware pour gérer l'annulation
orderSchema.pre("findByIdAndUpdate", function () {
  if (
    this._update.status === "cancelled" &&
    !this._update.cancellationReason
  ) {
    throw new Error(
      "La raison d'annulation est requise quand on annule une commande"
    );
  }
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
