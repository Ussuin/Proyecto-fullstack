// backend/src/server.js
require('dotenv').config();
const dns = require('dns');
const http = require('http');
const connectDB = require('./db');
const app = require('./app'); // importa tu app de Express

// Configurar Google DNS para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Conectar a MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log('MongoDB Atlas connection ready');
});
