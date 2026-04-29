const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Base de donnée connectée...")
    } catch (error) {
        console.log("Problème de connexion de la BD", error);
        process.exit(1)
    }
}
module.exports= connectDB