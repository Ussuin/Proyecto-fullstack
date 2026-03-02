<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
    <div v-if="loading" class="loading">Cargando mapa...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const props = defineProps({
  address: String,
  lat: Number,
  lng: Number,
  zoom: { type: Number, default: 15 },
  height: { type: String, default: '300px' }
})

const emit = defineEmits(['location-found'])

const mapContainer = ref(null)
const loading = ref(false)
const error = ref('')
let map = null
let marker = null

const initMap = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await nextTick()
    
    // Posición inicial
    let position = { lat: -34.6037, lng: -58.3816 } // Buenos Aires por defecto
    
    // Si hay coordenadas, usarlas
    if (props.lat && props.lng) {
      position = { lat: props.lat, lng: props.lng }
    }
    // Si hay dirección, geocodificarla
    else if (props.address) {
      position = await geocodeAddress(props.address)
    }
    
    // Destruir mapa existente si hay uno
    if (map) {
      map.remove()
    }
    
    // Crear mapa
    map = L.map(mapContainer.value).setView([position.lat, position.lng], props.zoom)
    
    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)
    
    // Agregar marcador
    marker = L.marker([position.lat, position.lng]).addTo(map)
    marker.bindPopup(props.address || 'Ubicación seleccionada').openPopup()
    
    // Emitir coordenadas encontradas
    emit('location-found', position)
    
  } catch (err) {
    error.value = 'Error al cargar el mapa: ' + err.message
    console.error('Error cargando mapa:', err)
  } finally {
    loading.value = false
  }
}

const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Error en la búsqueda de dirección')
    }
    
    const data = await response.json()
    
    if (!data || data.length === 0) {
      throw new Error('No se encontró la dirección')
    }
    
    const result = data[0]
    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    }
  } catch (err) {
    console.error('Error en geocodificación:', err)
    throw new Error('No se pudo encontrar la dirección')
  }
}

// Watch para cambios en props
watch([() => props.address, () => props.lat, () => props.lng], () => {
  if (map) {
    initMap()
  }
})

onMounted(() => {
  initMap()
})

// Cleanup
const cleanup = () => {
  if (map) {
    map.remove()
    map = null
  }
}

onUnmounted(cleanup)
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
}

.map {
  width: 100%;
  height: v-bind(height);
  border-radius: 8px;
  border: 1px solid #ddd;
  z-index: 1;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  z-index: 1000;
}

.error {
  color: #d83b01;
  padding: 10px;
  background: #ffe6e6;
  border-radius: 4px;
  margin-top: 10px;
}

/* Estilos para el contenedor del mapa */
.map-container :deep(.leaflet-container) {
  font-family: inherit;
}

.map-container :deep(.leaflet-popup-content-wrapper) {
  border-radius: 6px;
}

.map-container :deep(.leaflet-popup-content) {
  margin: 12px 16px;
  line-height: 1.4;
}
</style>
