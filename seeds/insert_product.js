const mongoose = require("mongoose");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
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

const insertProduct = async () => {
  try {
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      console.log("Aucun restaurant disponible. Lancez d'abord insert_restaurants.js.");
      return;
    }

    const productData = {
      name: "Cheeseburger",
      category: "Burger",
      price: 8.5,
      description: "Burger avec fromage",
      available: true,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80",
      status: "published",
      restaurantId: restaurant._id,
    };

    const existingProduct = await Product.findOne({
      name: productData.name,
      restaurantId: restaurant._id,
    });

    if (!existingProduct) {
      await Product.create(productData);
      console.log("Produit ajoute avec succes.");
    } else {
      console.log("Le produit existe deja.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(insertProduct);
