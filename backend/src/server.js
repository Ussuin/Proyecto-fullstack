require('dotenv').config();
const dns = require('dns');
const http = require('http');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./db');
const app = require('./app'); // importa tu app de Express
const paymentsRouter = require('./routes/payments');
// Configurar Google DNS para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Conectar a MongoDB Atlas
connectDB();


app.use('/api', paymentsRouter);


const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API running on ${BACKEND_URL}`);
  console.log('MongoDB Atlas connection ready');
  console.log("Token cargado:", process.env.MP_ACCESS_TOKEN);
});
