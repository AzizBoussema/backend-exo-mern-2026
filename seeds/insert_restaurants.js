const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
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

const insertRestaurants = async () => {
  try {
    const restaurantsConfig = [
      {
        name: "Luigi",
        email: "pizza.bella@test.com",
        password: "password123",
        role: "restaurant",
        address: "Centre Ville",
        phone: "+21611111111",
        restaurant: {
          name: "Pizza Bella",
          businessName: "Pizza Bella",
          registrationRNE: "RNE001",
          specialties: ["Italien", "Pizzas"],
        },
      },
      {
        name: "Kenji",
        email: "sushi.express@test.com",
        password: "password123",
        role: "restaurant",
        address: "Lac 2",
        phone: "+21622222222",
        restaurant: {
          name: "Sushi Express",
          businessName: "Sushi Express",
          registrationRNE: "RNE002",
          specialties: ["Japonais", "Sushis"],
        },
      },
      {
        name: "Jean",
        email: "bistrot.parisien@test.com",
        password: "password123",
        role: "restaurant",
        address: "Marsa",
        phone: "+21633333333",
        restaurant: {
          name: "Le Bistrot Parisien",
          businessName: "Le Bistrot Parisien",
          registrationRNE: "RNE003",
          specialties: ["Francais", "Traditionnel"],
        },
      },
      {
        name: "Carlos",
        email: "tacos.locos@test.com",
        password: "password123",
        role: "restaurant",
        address: "Soukra",
        phone: "+21644444444",
        restaurant: {
          name: "Tacos Locos",
          businessName: "Tacos Locos",
          registrationRNE: "RNE004",
          specialties: ["Mexicain", "Tacos"],
        },
      },
    ];

    for (const data of restaurantsConfig) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          name: data.name,
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
          role: data.role,
          address: data.address,
          phone: data.phone,
        });
        console.log(`Compte cree: ${data.restaurant.businessName}`);
      }

      const existingRestaurant = await Restaurant.findOne({ ownerId: user._id });
      if (!existingRestaurant) {
        await Restaurant.create({
          ownerId: user._id,
          ...data.restaurant,
          email: user.email,
          address: data.address,
          phone: data.phone,
        });
        console.log(`Restaurant ajoute: ${data.restaurant.businessName}`);
      } else {
        console.log(`Le restaurant ${data.restaurant.businessName} existe deja.`);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout des restaurants:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(insertRestaurants);