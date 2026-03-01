const express = require("express");
const router = express.Router();

// Obtener clima actual
router.get("/current/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const baseUrl = process.env.OPENWEATHER_BASE_URL;
    
    console.log("API Key:", apiKey);
    console.log("Base URL:", baseUrl);
    
    if (!apiKey) {
      return res.status(500).json({ error: "API key no configurada" });
    }
    
    const url = `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
    console.log("Request URL:", url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Response status:", response.status);
    console.log("Response data:", data);
    
    if (response.ok) {
      res.json({
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon
      });
    } else {
      res.status(data.cod).json({ error: data.message });
    }
  } catch (error) {
    console.error("Error obteniendo clima:", error);
    res.status(500).json({ error: "Error al obtener datos del clima" });
  }
});

// Obtener pronóstico del clima
router.get("/forecast/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const baseUrl = process.env.OPENWEATHER_BASE_URL;
    
    if (!apiKey) {
      return res.status(500).json({ error: "API key no configurada" });
    }
    
    const url = `${baseUrl}/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      // Procesar pronóstico para los próximos 5 días
      const forecast = data.list.filter((item, index) => index % 8 === 0).map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));
      
      res.json({
        city: data.city.name,
        country: data.city.country,
        forecast
      });
    } else {
      res.status(data.cod).json({ error: data.message });
    }
  } catch (error) {
    console.error("Error obteniendo pronóstico:", error);
    res.status(500).json({ error: "Error al obtener pronóstico del clima" });
  }
});

module.exports = router;