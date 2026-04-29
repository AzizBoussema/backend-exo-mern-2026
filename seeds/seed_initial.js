const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Product = require("../models/Product");
const Order = require("../models/Order");

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB Atlas
    const MONGO_URL = "mongodb+srv://azizboussemaprojetgomycode:projetgomycode2026@cluster0.asallbb.mongodb.net/gomycode?retryWrites=true&w=majority";
    
    await mongoose.connect(MONGO_URL);

    console.log("✅ Connecté à MongoDB");

    // Vider les collections
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log("🗑️ Collections vidées");

    // ============================================
    // 1. Créer les Utilisateurs (Clients & Restaurateurs)
    // ============================================

    const hashedPassword = await bcrypt.hash("Password123", 10);

    const users = await User.insertMany([
      // Clients
      {
        name: "Ahmed Hamza",
        email: "ahmed.hamza@email.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Ahmed",
        isAdmin: false,
        role: "client",
        firstName: "Ahmed",
        lastName: "Hamza",
        address: "123 Rue de Tunis, Tunis 1000",
        phone: "+216 55 123 456",
      },
      {
        name: "Leila Gharbi",
        email: "leila.gharbi@email.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Leila",
        isAdmin: false,
        role: "client",
        firstName: "Leila",
        lastName: "Gharbi",
        address: "456 Rue Mohamed V, Tunis 1000",
        phone: "+216 50 654 321",
      },
      {
        name: "Karim Bnissi",
        email: "karim.bnissi@email.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Karim",
        isAdmin: false,
        role: "client",
        firstName: "Karim",
        lastName: "Bnissi",
        address: "789 Rue Habib Bourguiba, Sousse 4000",
        phone: "+216 95 789 012",
      },
      {
        name: "Fatima Zahra",
        email: "fatima.zahra@email.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Fatima",
        isAdmin: false,
        role: "client",
        firstName: "Fatima",
        lastName: "Zahra",
        address: "321 Rue de la Paix, Sfax 3000",
        phone: "+216 20 345 678",
      },

      // Restaurateurs
      {
        name: "Hamdi Ben Salah",
        email: "hamdi@pizzeria.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Hamdi",
        isAdmin: false,
        role: "restaurant",
        firstName: "Hamdi",
        lastName: "Ben Salah",
        address: "456 Avenue Mohamed V, Tunis 1000",
        phone: "+216 71 234 567",
      },
      {
        name: "Nadia Khmiri",
        email: "nadia@sushi.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Nadia",
        isAdmin: false,
        role: "restaurant",
        firstName: "Nadia",
        lastName: "Khmiri",
        address: "789 Rue Liberté, Tunis 1000",
        phone: "+216 71 567 890",
      },
      {
        name: "Mohamed Latrous",
        email: "mohamed@burger.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Mohamed",
        isAdmin: false,
        role: "restaurant",
        firstName: "Mohamed",
        lastName: "Latrous",
        address: "101 Boulevard de la Gare, Tunis 1000",
        phone: "+216 71 890 123",
      },
      {
        name: "Houda Zouari",
        email: "houda@couscous.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Houda",
        isAdmin: false,
        role: "restaurant",
        firstName: "Houda",
        lastName: "Zouari",
        address: "202 Rue des Jardins, Sfax 3000",
        phone: "+216 74 345 678",
      },

      // Admin
      {
        name: "Admin GoMyCode",
        email: "admin@gomycode.com",
        password: hashedPassword,
        image: "https://via.placeholder.com/150?text=Admin",
        isAdmin: true,
        role: "client",
        firstName: "Admin",
        lastName: "System",
        phone: "+216 55 000 000",
      },
    ]);

    console.log(`✅ ${users.length} utilisateurs créés`);

    // ============================================
    // 2. Créer les Restaurants
    // ============================================

    const restaurants = await Restaurant.insertMany([
      {
        name: "Pizza Deluxe",
        businessName: "Pizza Deluxe SARL",
        description:
          "Restaurant de pizzas authentiques avec ingrédients frais importés d'Italie",
        image:
          "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=280&fit=crop",
        address: "456 Avenue Mohamed V, Tunis 1000",
        phone: "+216 71 234 567",
        email: "contact@pizzadeluxe.com",
        registrationRNE: "RNE-2024-001234",
        specialties: ["Pizza", "Pâtes", "Salades", "Desserts"],
        deliveryZones: ["Tunis", "Ariana", "Ben Arous"],
        rating: 4.8,
        deliveryTime: "25-35 min",
        ownerId: users[4]._id,
        isActive: true,
      },
      {
        name: "Sushi Paradise",
        businessName: "Sushi Paradise EIRL",
        description:
          "Restaurant de sushi premium avec chefs japonais certifiés",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=280&fit=crop",
        address: "789 Rue Liberté, Tunis 1000",
        phone: "+216 71 567 890",
        email: "contact@sushiparadise.com",
        registrationRNE: "RNE-2024-001235",
        specialties: ["Sushi", "Sashimi", "Ramen", "Maki"],
        deliveryZones: ["Tunis", "La Marsa", "Carthage"],
        rating: 4.9,
        deliveryTime: "30-40 min",
        ownerId: users[5]._id,
        isActive: true,
      },
      {
        name: "Burger House",
        businessName: "Burger House LLC",
        description:
          "Burgers artisanaux avec bœuf 100% Angus et sauces maison",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=280&fit=crop",
        address: "101 Boulevard de la Gare, Tunis 1000",
        phone: "+216 71 890 123",
        email: "contact@burgerhouse.com",
        registrationRNE: "RNE-2024-001236",
        specialties: ["Burgers", "Frites", "Shakes", "Salades"],
        deliveryZones: ["Tunis", "Monastir"],
        rating: 4.6,
        deliveryTime: "20-30 min",
        ownerId: users[6]._id,
        isActive: true,
      },
      {
        name: "Couscous Sfaxien",
        businessName: "Couscous Sfaxien SARL",
        description: "Couscous traditionnel sfaxien avec recettes authentiques",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop",
        address: "202 Rue des Jardins, Sfax 3000",
        phone: "+216 74 345 678",
        email: "contact@couscoussfaxien.com",
        registrationRNE: "RNE-2024-001237",
        specialties: ["Couscous", "Tajine", "Brik", "Pâtisserie"],
        deliveryZones: ["Sfax", "Skhira", "Mahdia"],
        rating: 4.7,
        deliveryTime: "35-45 min",
        ownerId: users[7]._id,
        isActive: true,
      },
    ]);

    console.log(`✅ ${restaurants.length} restaurants créés`);

    // ============================================
    // 3. Créer les Produits
    // ============================================

    const products = await Product.insertMany([
      // Pizza Deluxe Products
      {
        name: "Pizza Margherita",
        description:
          "Tomate, mozzarella, basilic frais, huile d'olive extra vierge",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=200&fit=crop",
        category: "Pizza",
        restaurantId: restaurants[0]._id,
        available: true,
        status: "published",
        calories: 280,
        ingredients: [
          "Tomate",
          "Mozzarella",
          "Basilic",
          "Huile d'olive",
        ],
        allergens: ["Gluten", "Lactose"],
      },
      {
        name: "Pizza Quattro Formaggi",
        description:
          "Mozzarella, Parmesan, Gorgonzola, Chèvre sur sauce tomate",
        price: 15.99,
        image:
          "https://images.unsplash.com/photo-1571997477754-7ae68e2f2ecf?w=300&h=200&fit=crop",
        category: "Pizza",
        restaurantId: restaurants[0]._id,
        available: true,
        status: "published",
        calories: 320,
        ingredients: [
          "Mozzarella",
          "Parmesan",
          "Gorgonzola",
          "Chèvre",
          "Sauce tomate",
        ],
        allergens: ["Gluten", "Lactose"],
      },
      {
        name: "Pâtes Carbonara",
        description:
          "Pâtes fraîches avec lard croustillant, œuf et parmesan",
        price: 11.99,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop",
        category: "Pâtes",
        restaurantId: restaurants[0]._id,
        available: true,
        status: "published",
        calories: 450,
        ingredients: [
          "Pâtes",
          "Lard",
          "Œuf",
          "Parmesan",
          "Ail",
        ],
        allergens: ["Gluten", "Lactose", "Œuf"],
      },
      {
        name: "Salade Nicoise",
        description: "Laitue, thon, œuf, anchois, olives noires",
        price: 9.99,
        image:
          "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop",
        category: "Salades",
        restaurantId: restaurants[0]._id,
        available: true,
        status: "published",
        calories: 220,
        ingredients: [
          "Laitue",
          "Thon",
          "Œuf",
          "Anchois",
          "Olives",
        ],
        allergens: ["Poisson"],
      },
      {
        name: "Tiramisu",
        description: "Dessert italien classique avec café et mascarpone",
        price: 6.99,
        image:
          "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&h=200&fit=crop",
        category: "Desserts",
        restaurantId: restaurants[0]._id,
        available: true,
        status: "published",
        calories: 350,
        ingredients: [
          "Mascarpone",
          "Café",
          "Œuf",
          "Sucre",
          "Cacao",
        ],
        allergens: ["Lactose", "Œuf"],
      },

      // Sushi Paradise Products
      {
        name: "California Roll",
        description: "Crabe imitation, concombre, avocat, œufs",
        price: 8.99,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
        category: "Sushi",
        restaurantId: restaurants[1]._id,
        available: true,
        status: "published",
        calories: 240,
        ingredients: [
          "Riz",
          "Crabe",
          "Concombre",
          "Avocat",
          "Nori",
        ],
        allergens: ["Poisson"],
      },
      {
        name: "Spicy Tuna Roll",
        description: "Thon épicé avec mayo épicée et sriracha",
        price: 9.99,
        image:
          "https://images.unsplash.com/photo-1580822261290-991b38693d1b?w=300&h=200&fit=crop",
        category: "Sushi",
        restaurantId: restaurants[1]._id,
        available: true,
        status: "published",
        calories: 260,
        ingredients: [
          "Riz",
          "Thon",
          "Mayo épicée",
          "Sriracha",
          "Nori",
        ],
        allergens: ["Poisson"],
      },
      {
        name: "Ramen Tonkotsu",
        description: "Nouilles ramen dans un bouillon riche et savoureux",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1579438823298-202b2b41d63d?w=300&h=200&fit=crop",
        category: "Ramen",
        restaurantId: restaurants[1]._id,
        available: true,
        status: "published",
        calories: 450,
        ingredients: [
          "Ramen",
          "Porc",
          "Bouillon",
          "Œuf",
          "Germes",
        ],
        allergens: ["Gluten"],
      },

      // Burger House Products
      {
        name: "Angus Classic",
        description: "Burger avec bœuf 100% Angus, laitue, tomate, oignon",
        price: 10.99,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
        category: "Burgers",
        restaurantId: restaurants[2]._id,
        available: true,
        status: "published",
        calories: 520,
        ingredients: [
          "Bœuf Angus",
          "Pain",
          "Laitue",
          "Tomate",
          "Oignon",
          "Sauce",
        ],
        allergens: ["Gluten"],
      },
      {
        name: "Double Cheese Burger",
        description: "Double steak avec double fromage et sauce spéciale",
        price: 12.99,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
        category: "Burgers",
        restaurantId: restaurants[2]._id,
        available: true,
        status: "published",
        calories: 680,
        ingredients: [
          "Bœuf Angus x2",
          "Fromage x2",
          "Pain",
          "Sauce spéciale",
        ],
        allergens: ["Gluten", "Lactose"],
      },
      {
        name: "Frites Saupoudrées",
        description: "Frites croustillantes avec sel de mer et épices",
        price: 4.99,
        image:
          "https://images.unsplash.com/photo-1573080496004-6b36fc3ae4dc?w=300&h=200&fit=crop",
        category: "Frites",
        restaurantId: restaurants[2]._id,
        available: true,
        status: "published",
        calories: 320,
        ingredients: ["Pommes de terre", "Huile", "Sel", "Épices"],
        allergens: [],
      },

      // Couscous Sfaxien Products
      {
        name: "Couscous aux Sept Légumes",
        description:
          "Couscous traditionnel avec sept variétés de légumes frais",
        price: 11.99,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
        category: "Couscous",
        restaurantId: restaurants[3]._id,
        available: true,
        status: "published",
        calories: 380,
        ingredients: [
          "Couscous",
          "Carottes",
          "Navets",
          "Pois chiches",
          "Courge",
        ],
        allergens: ["Gluten"],
      },
      {
        name: "Tajine Poulet Citron",
        description: "Tajine traditionnel avec poulet tendre et citron confit",
        price: 13.99,
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07f128?w=300&h=200&fit=crop",
        category: "Tajine",
        restaurantId: restaurants[3]._id,
        available: true,
        status: "published",
        calories: 420,
        ingredients: [
          "Poulet",
          "Citron confit",
          "Oignon",
          "Ail",
          "Épices",
        ],
        allergens: [],
      },
      {
        name: "Brik aux Œufs",
        description: "Feuilletée croustillante avec œuf et persil",
        price: 5.99,
        image:
          "https://images.unsplash.com/photo-1619894169264-d2f7e3f26eca?w=300&h=200&fit=crop",
        category: "Brik",
        restaurantId: restaurants[3]._id,
        available: true,
        status: "published",
        calories: 280,
        ingredients: ["Pâte feuilletée", "Œuf", "Persil", "Huile"],
        allergens: ["Gluten", "Œuf"],
      },
    ]);

    console.log(`✅ ${products.length} produits créés`);

    // ============================================
    // 4. Créer les Commandes
    // ============================================

    const orders = await Order.insertMany([
      {
        userId: users[0]._id,
        restaurantId: restaurants[0]._id,
        products: [
          {
            productId: products[0]._id,
            name: "Pizza Margherita",
            price: 12.99,
            quantity: 2,
            image: products[0].image,
          },
          {
            productId: products[4]._id,
            name: "Tiramisu",
            price: 6.99,
            quantity: 1,
            image: products[4].image,
          },
        ],
        totalAmount: 32.97,
        deliveryAddress: "123 Rue de Tunis, Tunis 1000",
        paymentMethod: "card",
        status: "delivered",
        notes: "Sans oignons sur la première pizza SVP",
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
      },
      {
        userId: users[1]._id,
        restaurantId: restaurants[1]._id,
        products: [
          {
            productId: products[5]._id,
            name: "California Roll",
            price: 8.99,
            quantity: 3,
            image: products[5].image,
          },
          {
            productId: products[7]._id,
            name: "Ramen Tonkotsu",
            price: 12.99,
            quantity: 1,
            image: products[7].image,
          },
        ],
        totalAmount: 39.96,
        deliveryAddress: "456 Rue Mohamed V, Tunis 1000",
        paymentMethod: "cash",
        status: "preparing",
        notes: "Attention allergies arachides",
        estimatedDeliveryTime: new Date(Date.now() + 40 * 60000),
      },
      {
        userId: users[2]._id,
        restaurantId: restaurants[2]._id,
        products: [
          {
            productId: products[8]._id,
            name: "Angus Classic",
            price: 10.99,
            quantity: 2,
            image: products[8].image,
          },
          {
            productId: products[10]._id,
            name: "Frites Saupoudrées",
            price: 4.99,
            quantity: 2,
            image: products[10].image,
          },
        ],
        totalAmount: 31.96,
        deliveryAddress: "789 Rue Habib Bourguiba, Sousse 4000",
        paymentMethod: "card",
        status: "pending",
        notes: "",
        estimatedDeliveryTime: new Date(Date.now() + 25 * 60000),
      },
      {
        userId: users[3]._id,
        restaurantId: restaurants[3]._id,
        products: [
          {
            productId: products[12]._id,
            name: "Couscous aux Sept Légumes",
            price: 11.99,
            quantity: 1,
            image: products[12].image,
          },
          {
            productId: products[14]._id,
            name: "Brik aux Œufs",
            price: 5.99,
            quantity: 2,
            image: products[14].image,
          },
        ],
        totalAmount: 23.97,
        deliveryAddress: "321 Rue de la Paix, Sfax 3000",
        paymentMethod: "cash",
        status: "confirmed",
        notes: "Livrer entre 19h et 20h",
        estimatedDeliveryTime: new Date(Date.now() + 40 * 60000),
      },
    ]);

    console.log(`✅ ${orders.length} commandes créées`);

    // ============================================
    // Résumé
    // ============================================

    console.log("\n" + "=".repeat(50));
    console.log("✅ DATABASE SEEDING COMPLETED!");
    console.log("=".repeat(50));
    console.log(`
📊 Données insérées:
   • ${users.length} Utilisateurs (4 clients, 4 restaurateurs, 1 admin)
   • ${restaurants.length} Restaurants
   • ${products.length} Produits
   • ${orders.length} Commandes

🔑 Identifiants de connexion test:
   
   Client:
   Email: ahmed.hamza@email.com
   Password: Password123

   Restaurateur:
   Email: hamdi@pizzeria.com
   Password: Password123

   Admin:
   Email: admin@gomycode.com
   Password: Password123
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error.message);
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
