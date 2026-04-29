const mongoose = require("mongoose");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connecte pour migration...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const migrate = async () => {
  try {
    const restaurantUsers = await User.find({ role: "restaurant" });

    for (const user of restaurantUsers) {
      const existingRestaurant = await Restaurant.findOne({ ownerId: user._id });
      if (!existingRestaurant) {
        await Restaurant.create({
          ownerId: user._id,
          name: user.name,
          businessName: user.name,
          image: user.image,
          address: user.address,
          phone: user.phone,
          email: user.email,
        });
        console.log(`[+] Restaurant cree pour ${user.email}`);
      }
    }

    const restaurants = await Restaurant.find();
    for (const restaurant of restaurants) {
      await Product.updateMany(
        { restaurantId: { $exists: false } },
        { $set: { restaurantId: restaurant._id } }
      );
    }

    console.log("Migration terminee avec succes.");
  } catch (error) {
    console.error("Erreur de migration:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(migrate);
