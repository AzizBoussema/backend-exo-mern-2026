const mongoose = require("mongoose");
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

const insertMenus = async () => {
  try {
    const menus = [
      {
        restaurantName: "Pizza Bella",
        items: [
          { name: "Pizza 4 Fromages", description: "Pizza mozzarella, emmental, chevre et roquefort.", price: 14.5, category: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" },
          { name: "Pizza Reine", description: "Sauce tomate, mozzarella, jambon blanc et champignons.", price: 12.0, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80" },
        ],
      },
      {
        restaurantName: "Sushi Express",
        items: [
          { name: "Sashimi au Saumon", description: "Tranches de saumon frais.", price: 16.0, category: "Japonais", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" },
          { name: "Maki California", description: "Maki avocat, surimi et sesame.", price: 8.5, category: "Japonais", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80" },
        ],
      },
    ];

    for (const data of menus) {
      const restaurant = await Restaurant.findOne({
        $or: [{ businessName: data.restaurantName }, { name: data.restaurantName }],
      });

      if (!restaurant) {
        console.log(`Restaurant introuvable: ${data.restaurantName}`);
        continue;
      }

      for (const item of data.items) {
        const existingProduct = await Product.findOne({
          name: item.name,
          restaurantId: restaurant._id,
        });

        if (!existingProduct) {
          await Product.create({
            ...item,
            restaurantId: restaurant._id,
            status: "published",
            available: true,
          });
          console.log(`[+] Produit insere: ${item.name} pour ${restaurant.businessName || restaurant.name}`);
        } else {
          console.log(`[-] Le produit ${item.name} existe deja pour ${restaurant.businessName || restaurant.name}`);
        }
      }
    }
  } catch (error) {
    console.error("Erreur globale:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(insertMenus);
