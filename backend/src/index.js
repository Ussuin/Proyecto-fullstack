// Entry point para despliegue serverless en Vercel
// Exporta la app de Express para que @vercel/node la use como handler
require('dotenv').config();
const app = require('./app');

// Exporta la app directamente — Vercel envuelve esta función y la ejecuta
module.exports = app;
