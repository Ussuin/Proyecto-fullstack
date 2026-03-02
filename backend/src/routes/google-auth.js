const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();

// URL base configurables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

// Configuración de Passport con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI || `${BACKEND_URL}/auth/google/callback`,
    },
    (accesToken, refreshToken,profile, done) => {
  console.log("Google Strategy callbackURL:", process.env.GOOGLE_REDIRECT_URI || `${BACKEND_URL}/auth/google/callback`);
      // Aquí normalmente guardarías el usuario en la base de datos
      // Por ahora, solo retornamos el perfil
      return done(null, profile);
    }
  )
);

// Serialización y deserialización (requeridas por Passport)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Endpoint para iniciar sesión con Google
router.get("/google", (req, res) => {
  console.log("Google auth endpoint hit");
  console.log("Request URL:", req.protocol + '://' + req.get('host') + req.originalUrl);
  console.log("Callback URL being used:", process.env.GOOGLE_REDIRECT_URI || `${BACKEND_URL}/auth/google/callback`);
  
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    callbackURL: process.env.GOOGLE_REDIRECT_URI || `${BACKEND_URL}/auth/google/callback`
  })(req, res);
});

// Callback de Google (redirección después del login)


router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const userData = {
      message: "Autenticación exitosa con Google",
      user: req.user
    };
    // Redirigir al frontend configurado (FRONTEND_URL) con la info de usuario
    res.redirect(`${FRONTEND_URL}?auth=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports = router;
