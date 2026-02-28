const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log("🔍 URI:", process.env.MONGODB_URI); 
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
