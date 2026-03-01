// backend/src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const usuarios = require("./routes/usuarios");
const profesores = require("./routes/profesores");
const alumnos = require("./routes/alumnos");
const clases = require("./routes/clases");
const horarios = require("./routes/horarios");
const googleAuth = require("./routes/google-auth");
const githubAuth = require("./routes/github-auth");
const weather = require("./routes/weather");

const app = express();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-super-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // false para desarrollo (http), true para producción (https)
}));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "API running 🎵" }));

app.use("/usuarios", usuarios);
app.use("/profesores", profesores);
app.use("/alumnos", alumnos);
app.use("/clases", clases);
app.use("/horarios", horarios);
app.use("/auth", googleAuth);
app.use("/auth", githubAuth);
app.use("/weather", weather);

// error handler simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

module.exports = app;
