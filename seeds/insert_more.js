const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Base de donnees connectee...");
  } catch (error) {
    console.error("Erreur de connexion a la base:", error);
    process.exit(1);
  }
};

const insertRemaining = async () => {
  try {
    const restaurant = await Restaurant.findOne({
      $or: [{ businessName: "Le Gourmet" }, { name: "Le Gourmet" }],
    });

    if (!restaurant) {
      console.log("Restaurant 'Le Gourmet' introuvable.");
      return;
    }

    const products = [
      {
        name: "Tacos au Poulet",
        description: "Tacos au poulet epice, salsa et guacamole.",
        price: 11.5,
        category: "Mexicain",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Pates Carbonara",
        description: "Pates italiennes avec sauce cremeuse et parmesan.",
        price: 13.99,
        category: "Pates",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Sushi Mix",
        description: "Assortiment de sushis frais avec saumon, thon et legumes.",
        price: 18.99,
        category: "Japonais",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80",
      },
    ];

    for (const data of products) {
      const existing = await Product.findOne({ name: data.name, restaurantId: restaurant._id });
      if (!existing) {
        await Product.create({
          ...data,
          restaurantId: restaurant._id,
          status: "published",
          available: true,
        });
        console.log(`[+] Ajoute: ${data.name}`);
      } else {
        console.log(`[-] Deja existant: ${data.name}`);
      }
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(insertRemaining);
