const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const router = express.Router();

// URL base configurables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;

// Inicializar Passport
router.use(passport.initialize());
router.use(passport.session());

// Configuración de Passport con GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_REDIRECT_URI || `${BACKEND_URL}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
  console.log("GitHub Strategy callbackURL:", process.env.GITHUB_REDIRECT_URI || `${BACKEND_URL}/auth/github/callback`);
      // Aquí normalmente guardarías el usuario en la base de datos
      // Por ahora, solo retornamos el perfil
      return done(null, profile);
    }
  )
);

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Endpoint para iniciar sesión con GitHub
router.get("/github", (req, res) => {
  console.log("GitHub auth endpoint hit");
  console.log("Request URL:", req.protocol + '://' + req.get('host') + req.originalUrl);
  console.log("Callback URL being used:", process.env.GITHUB_REDIRECT_URI || `${BACKEND_URL}/auth/github/callback`);
  
  passport.authenticate("github", { 
    scope: ["user:email"],
    callbackURL: process.env.GITHUB_REDIRECT_URI || `${BACKEND_URL}/auth/github/callback`
  })(req, res);
});

// Callback de GitHub (redirección después del login)
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Autenticación exitosa - redirigir al frontend con los datos del usuario
    const userData = {
      message: "Autenticación exitosa con GitHub",
      user: {
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName,
        email: req.user.emails && req.user.emails[0] ? req.user.emails[0].value : null,
        avatar: req.user.photos && req.user.photos[0] ? req.user.photos[0].value : null,
        provider: "github"
      }
    };
    
    // Redirigir al frontend (FRONTEND_URL) con los datos como query parameter
    res.redirect(`${FRONTEND_URL}?auth=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports = router;