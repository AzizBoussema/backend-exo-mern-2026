const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Base de donnees connectee...");
  } catch (error) {
    console.error("Erreur de connexion a la base de donnees:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log("Les donnees existent deja.");
      return;
    }

    let restaurantUser = await User.findOne({ email: "chef@test.com" });
    if (!restaurantUser) {
      restaurantUser = await User.create({
        name: "Chef Dupont",
        firstName: "Chef",
        lastName: "Dupont",
        email: "chef@test.com",
        password: await bcrypt.hash("password123", 10),
        role: "restaurant",
        address: "123 Rue de la Gourmandise",
        phone: "+21600000000",
      });
    }

    let restaurant = await Restaurant.findOne({ ownerId: restaurantUser._id });
    if (!restaurant) {
      restaurant = await Restaurant.create({
        ownerId: restaurantUser._id,
        name: "Le Gourmet",
        businessName: "Le Gourmet",
        description: "Cuisine francaise et italienne.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
        address: "123 Rue de la Gourmandise",
        phone: "+21600000000",
        email: restaurantUser.email,
        registrationRNE: "123456789",
        specialties: ["Francais", "Italien"],
      });
    }

    const products = [
      {
        name: "Burger Classique",
        description: "Un burger avec steak hache, fromage, laitue et tomate.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
        category: "Burger",
        restaurantId: restaurant._id,
        status: "published",
      },
      {
        name: "Pizza Margherita",
        description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic.",
        price: 14.5,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
        category: "Pizza",
        restaurantId: restaurant._id,
        status: "published",
      },
      {
        name: "Salade Cesar",
        description: "Salade fraiche avec poulet grille, parmesan et sauce Cesar.",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=400&q=80",
        category: "Salade",
        restaurantId: restaurant._id,
        status: "published",
      },
    ];

    await Product.insertMany(products);
    console.log("Donnees de test ajoutees avec succes.");
  } catch (error) {
    console.error("Erreur lors de l'ajout des donnees:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(seedData);
