# OpenStreetMap API - Guía de Uso Completa

## 🆓 100% GRATIS - Sin API Keys - Sin Tarjetas de Crédito

## 📁 Archivos Creados

### Frontend
- `frontend/src/components/OpenStreetMap.vue` - Componente del mapa
- `package.json` - Dependencia Leaflet.js agregada

### Backend  
- `backend/src/routes/openstreetmap.js` - Rutas API de OpenStreetMap
- `backend/src/app.js` - Rutas configuradas

## 🚀 Uso Rápido

### 1. Importar el componente
```vue
<script setup>
import OpenStreetMap from './components/OpenStreetMap.vue'
</script>
```

### 2. Usar en el template
```vue
<template>
  <!-- Mostrar mapa con dirección -->
  <OpenStreetMap 
    address="Av. Corrientes 1000, Buenos Aires, Argentina" 
    height="400px"
    @location-found="onLocationFound"
  />
  
  <!-- Mostrar mapa con coordenadas -->
  <OpenStreetMap 
    :lat="-34.6037" 
    :lng="-58.3816"
    :zoom="16"
    height="300px"
  />
</template>

<script setup>
import OpenStreetMap from './components/OpenStreetMap.vue'

const onLocationFound = (location) => {
  console.log('Ubicación encontrada:', location)
  // { lat: -34.6037, lng: -58.3816 }
}
</script>
```

## 🔌 API Endpoints Disponibles

### 1. Geocodificación (dirección → coordenadas)
```javascript
const response = await fetch('http://localhost:3000/openstreetmap/geocode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    address: 'Av. Corrientes 1000, Buenos Aires, Argentina' 
  })
})
const data = await response.json()
```

**Respuesta:**
```json
{
  "address": "Avenida Corrientes 1000, San Nicolás, Buenos Aires, Argentina",
  "lat": -34.6037,
  "lng": -58.3816,
  "place_id": "123456789",
  "address_details": {
    "house_number": "1000",
    "road": "Avenida Corrientes",
    "suburb": "San Nicolás",
    "city": "Buenos Aires",
    "country": "Argentina"
  }
}
```

### 2. Reverse Geocoding (coordenadas → dirección)
```javascript
const response = await fetch('http://localhost:3000/openstreetmap/reverse-geocode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    lat: -34.6037, 
    lng: -58.3816 
  })
})
```

### 3. Lugares Cercanos
```javascript
const response = await fetch('http://localhost:3000/openstreetmap/nearby', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    lat: -34.6037, 
    lng: -58.3816,
    radius: 1000, // metros
    tags: {
      "amenity": "restaurant" // o "shop", "school", etc.
    }
  })
})
```

### 4. Búsqueda de Lugares
```javascript
const response = await fetch('http://localhost:3000/openstreetmap/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: "Teatro Colón Buenos Aires",
    limit: 10
  })
})
```

## 🎨 Props del Componente OpenStreetMap

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `address` | String | - | Dirección para geocodificar |
| `lat` | Number | - | Latitud (coordenadas directas) |
| `lng` | Number | - | Longitud (coordenadas directas) |
| `zoom` | Number | 15 | Nivel de zoom (1-19) |
| `height` | String | "300px" | Altura del mapa |

## 📡 Eventos Emitidos

| Evento | Parámetros | Descripción |
|---------|------------|-------------|
| `location-found` | `{lat, lng}` | Se emite cuando se encuentra la ubicación |

## 🏫 Ejemplo Práctico para Escuela de Música

### Formulario de dirección de alumno
```vue
<template>
  <div>
    <h3>Dirección del Alumno</h3>
    <input 
      v-model="direccion" 
      placeholder="Ingresa la dirección completa"
      @blur="updateMap"
      style="width: 100%; padding: 10px; margin-bottom: 10px;"
    />
    
    <OpenStreetMap 
      :address="direccion"
      height="300px"
      @location-found="saveCoordinates"
    />
    
    <div v-if="coordinates">
      <p><strong>Coordenadas guardadas:</strong></p>
      <p>Lat: {{ coordinates.lat }}</p>
      <p>Lng: {{ coordinates.lng }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OpenStreetMap from './components/OpenStreetMap.vue'

const direccion = ref('')
const coordinates = ref(null)

const updateMap = () => {
  // El mapa se actualiza automáticamente al cambiar la dirección
}

const saveCoordinates = (location) => {
  coordinates.value = location
  // Aquí puedes guardar las coordenadas en tu base de datos
  console.log('Guardando coordenadas:', location)
}
</script>
```

### Mostrar ubicación de profesores
```vue
<template>
  <div>
    <h3>Ubicación de Profesores</h3>
    <div v-for="profesor in profesores" :key="profesor.id" class="profesor-card">
      <h4>{{ profesor.nombre }}</h4>
      <p>{{ profesor.direccion }}</p>
      <OpenStreetMap 
        :address="profesor.direccion"
        height="200px"
      />
    </div>
  </div>
</template>
```

## ⚡ Ventajas vs Google Maps

| Característica | OpenStreetMap | Google Maps |
|---------------|---------------|-------------|
| **Costo** | 🆓 100% GRATIS | 💰 $200/mes límite |
| **API Key** | ❌ No necesita | ✅ Requerida |
| **Tarjeta** | ❌ No necesita | ⚠️ Opcional |
| **Límites** | ♾️ Ilimitado | 📊 Limitado |
| **Privacidad** | 🔒 Sin tracking | 📊 Google tracking |
| **Código Abierto** | ✅ Sí | ❌ No |

## 🛠️ Tecnologías Utilizadas

- **Leaflet.js** - Librería de mapas interactivos
- **OpenStreetMap** - Datos del mapa (crowdsourced)
- **Nominatim** - API de geocodificación
- **Overpass API** - Búsqueda avanzada de lugares

## 🚨 Importante

- **Sin costos**: Todo es 100% gratuito
- **Sin límites**: Puedes hacer tantas peticiones como necesites
- **Sin registro**: No necesitas crear cuentas
- **Educacional**: Perfecto para proyectos escolares

¡Listo para usar en tu proyecto! 🎉
