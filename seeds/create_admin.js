/**
 * Script de création du compte administrateur
 * Usage : node seeds/create_admin.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Base de données connectée...");

    const adminEmail = "admin@savoryx.com";
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // Mettre à jour isAdmin via findOneAndUpdate pour éviter le middleware pre("save")
      await User.findOneAndUpdate(
        { email: adminEmail },
        { isAdmin: true },
        { runValidators: false }
      );
      console.log("✅ Compte admin mis à jour (isAdmin = true).");
      console.log("📧 Email    :", adminEmail);
      console.log("🔑 (mot de passe inchangé)");
    } else {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      // Insertion directe via insertOne pour contourner le middleware pre("save")
      await User.collection.insertOne({
        name: "Administrateur",
        firstName: "Super",
        lastName: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "client",
        isAdmin: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Compte admin créé avec succès !");
      console.log("📧 Email    :", adminEmail);
      console.log("🔑 Password : Admin@12345");
    }
  } catch (error) {
    console.error("❌ Erreur :", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Connexion fermée.");
  }
};

createAdmin();
