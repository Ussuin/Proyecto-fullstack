const express = require("express");
const router = express.Router();

// Geocodificación: convertir dirección a coordenadas usando Nominatim (OpenStreetMap)
router.post("/geocode", async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: "Dirección requerida" });
    }

    // Usar Nominatim API de OpenStreetMap (100% gratis)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MiEscuelaDeMusica/1.0 (educational-purpose@example.com)' // Es requerido por Nominatim
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Error en la API de Nominatim');
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Dirección no encontrada" });
    }
    
    const result = data[0];
    
    res.json({
      address: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      place_id: result.place_id,
      address_details: result.address
    });
    
  } catch (error) {
    console.error("Error en geocodificación:", error);
    res.status(500).json({ error: "Error del servidor: " + error.message });
  }
});

// Reverse geocoding: convertir coordenadas a dirección
router.post("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitud y longitud requeridas" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MiEscuelaDeMusica/1.0 (educational-purpose@example.com)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Error en la API de Nominatim');
    }
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(404).json({ error: "Ubicación no encontrada" });
    }
    
    res.json({
      address: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      place_id: data.place_id,
      address_details: data.address
    });
    
  } catch (error) {
    console.error("Error en reverse geocoding:", error);
    res.status(500).json({ error: "Error del servidor: " + error.message });
  }
});

// Buscar lugares cercanos usando Overpass API
router.post("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 1000, tags = {} } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitud y longitud requeridas" });
    }

    // Construir query para Overpass API
    let tagQuery = '';
    Object.entries(tags).forEach(([key, value]) => {
      tagQuery += `["${key}"="${value}"]`;
    });
    
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node${tagQuery}(around:${radius},${lat},${lng});
        way${tagQuery}(around:${radius},${lat},${lng});
        relation${tagQuery}(around:${radius},${lat},${lng});
      );
      out geom;
    `;
    
    const response = await fetch(
      `https://overpass-api.de/api/interpreter`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      }
    );
    
    if (!response.ok) {
      throw new Error('Error en la API de Overpass');
    }
    
    const data = await response.json();
    
    const places = data.elements.map(element => {
      let lat, lng;
      
      if (element.type === 'node') {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else if (element.bounds) {
        lat = (element.bounds.minlat + element.bounds.maxlat) / 2;
        lng = (element.bounds.minlon + element.bounds.maxlon) / 2;
      }
      
      return {
        id: element.id,
        type: element.type,
        name: element.tags?.name || 'Sin nombre',
        address: element.tags?.['addr:street'] || '',
        lat,
        lng,
        tags: element.tags,
        category: element.tags?.amenity || element.tags?.shop || element.tags?.tourism || 'other'
      };
    }).filter(place => place.lat && place.lng);
    
    res.json({
      places,
      count: places.length,
      center: { lat, lng },
      radius
    });
    
  } catch (error) {
    console.error("Error buscando lugares cercanos:", error);
    res.status(500).json({ error: "Error del servidor: " + error.message });
  }
});

// Búsqueda de lugares por nombre
router.post("/search", async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Query de búsqueda requerido" });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MiEscuelaDeMusica/1.0 (educational-purpose@example.com)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Error en la API de Nominatim');
    }
    
    const data = await response.json();
    
    const results = data.map(result => ({
      display_name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      place_id: result.place_id,
      type: result.type,
      importance: result.importance,
      address_details: result.address
    }));
    
    res.json({
      results,
      count: results.length
    });
    
  } catch (error) {
    console.error("Error en búsqueda de lugares:", error);
    res.status(500).json({ error: "Error del servidor: " + error.message });
  }
});

module.exports = router;
