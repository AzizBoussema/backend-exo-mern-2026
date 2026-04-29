const mongoose = require("mongoose");
const Product = require("../models/Product");
const Restaurant = require("../models/Restaurant");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Base de donnees connectee...");
  } catch (error) {
    console.error("Erreur de connexion:", error);
    process.exit(1);
  }
};

const fixOrphans = async () => {
  try {
    const restaurants = await Restaurant.find();
    if (restaurants.length === 0) {
      console.log("Aucun restaurant existant.");
      return;
    }

    const products = await Product.find().populate("restaurantId");
    let fixedCount = 0;

    for (const product of products) {
      const isOrphan =
        !product.restaurantId ||
        (product.restaurantId && !product.restaurantId.name && !product.restaurantId.businessName);

      if (isOrphan) {
        const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
        product.restaurantId = randomRestaurant._id;
        await product.save();
        console.log(`[FIX] '${product.name}' reassigne a : ${randomRestaurant.businessName || randomRestaurant.name}`);
        fixedCount += 1;
      }
    }

    console.log(`Operation terminee. Total corrige: ${fixedCount}`);
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(fixOrphans);
