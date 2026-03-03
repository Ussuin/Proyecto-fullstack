// backend/src/index.js
require('dotenv').config();
const dns = require('dns');
const http = require('http');
const connectDB = require('./src/db');
const app = require('./src/app'); // importa tu app de Express

// Configurar Google DNS para resolver MongoDB Atlas 
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Conectar a MongoDB Atlas
connectDB();

// Puerto dinámico 
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP con Express
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log('MongoDB Atlas connection ready');
  console.log("Token cargado:", process.env.MP_ACCESS_TOKEN);
});
