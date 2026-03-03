const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Configuración de Passport con GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_REDIRECT_URI 
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialización y deserialización
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Endpoint para iniciar sesión con GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Callback de GitHub
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const userData = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.emails?.[0]?.value || null,
      avatar: req.user.photos?.[0]?.value || null,
      provider: "github"
    };
    res.redirect(`${FRONTEND_URL}?auth=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports = router;
