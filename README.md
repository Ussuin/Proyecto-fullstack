Sistema de Gestión - Escuela de Música AARDEM

Bienvenido al repositorio oficial del proyecto **AARDEM**, una solución integral para la gestión de horarios, alumnos y clases, construida con tecnologías modernas de desarrollo web.

---

## Tecnologías Utilizadas

### **Frontend**

* **Vue.js 3 (Composition API):** Para una interfaz reactiva y moderna.
* **Vite:** Bundler de última generación para un desarrollo ultra rápido.
* **CSS Moderno:** Diseño modular y componentes escalables.

### **Backend**

* **Node.js & Express.js:** Servidor robusto para el manejo de la API REST.
* **MongoDB Atlas:** Base de datos en la nube para persistencia de datos.
* **OAuth:** Autenticación con Google y GitHub.
* **JWT:** Gestión de tokens de autenticación.
* **APIs Externas:** OpenWeatherMap (clima) y Mercado Pago (pagos).

---
## Video de youtube
* **https://youtu.be/o-kL0Z37DtA
## Instalación y Configuración

### Requisitos Previos
- **Node.js 18+** - [nodejs.org](https://nodejs.org)
- **Git**
- **Cuenta de MongoDB Atlas** (gratuita)

## Librerias Requeridas

## Librerias para el Backend
- npm install express
- npm install mongoose
- npm install cors
- npm install dotenv
- npm install nodemon save-dev
- npm install passport passport-google-oauth20 passport-github2
- npm install bcrypt jsonwebtoken
- npm install body-parser
- npm install morgan
- npm install axios
- npm install @googlemaps/js-api-loader
- npm install leaflet
  
## Librerias Para el Frontend
- npm install vue
- npm install vite
- npm install axios
- npm install vue-router
- npm install pinia


### 1. Clonar el repositorio
```bash
git clone https://github.com/Ussuin/Proyecto-fullstack.git
cd Proyecto-fullstack
```

### 2. Configurar Backend

#### Instalar dependencias
```bash
cd backend
npm install
```

#### Configurar variables de entorno
Crea un archivo `.env` en `backend/`:
```env
# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/escuela_musica

# Autenticación OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# APIs Externas
OPENWEATHER_API_KEY=tu-openweather-api-key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# Pagos
MP_ACCESS_TOKEN=tu-mercado-pago-access-token

# Sesión
SESSION_SECRET=tu-secreto-super-seguro
JWT_SECRET=tu-secreto-jwt-muy-seguro

# Servidor
PORT=3000
```

#### Iniciar Backend
```bash
node src/server.js
```

### 3. Configurar Frontend

#### Instalar dependencias
```bash
cd frontend
npm install
```

#### Configurar variables de entorno (opcional)
Crea un archivo `.env` en `frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

#### Iniciar Frontend
```bash
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## Arquitectura del Sistema

### Frontend (Interfaz de Usuario)

Se implementó una estructura de componentes modulares con Vue.js 3:

* **Calendar.vue**: Gestión visual de horarios y clases
* **WeatherWidget.vue**: Widget de clima en tiempo real
* **PaymentButton.vue**: Integración con Mercado Pago
* **LoginButton.vue**: Autenticación OAuth
* **OpenStreetMap.vue**: Mapas interactivos

### Backend (Servidor API)

El corazón del sistema corre sobre **Express**, con:

* **Endpoints REST**: Usuarios, profesores, alumnos, clases, horarios
* **Autenticación OAuth**: Google y GitHub
* **Middleware JWT**: Validación de tokens y roles
* **APIs Externas**: Clima y pagos integrados
* **Validación de datos**: Middleware personalizado

### Base de Datos (MongoDB Atlas)

* **Colecciones**: usuarios, profesores, alumnos, clases, horarios
* **Relaciones**: Referencias entre documentos
* **Escalabilidad**: Base de datos en la nube

---

## Funcionalidades Principales

### 🎵 Gestión Académica
- **CRUD completo** para usuarios, profesores, alumnos, clases y horarios
- **Validación de datos** y reglas de negocio
- **Control de solapamientos** en horarios

### 🔐 Autenticación y Autorización
- **OAuth** con Google y GitHub
- **JWT** para gestión de sesiones
- **Roles**: admin, profesor, alumno
- **Middleware** de protección de rutas

### 🌤️ Integración de APIs Externas
- **OpenWeatherMap**: Clima en tiempo real
- **Mercado Pago**: Sistema de pagos
- **OpenStreetMap**: Mapas interactivos

### 📱 Experiencia de Usuario
- **Diseño responsivo** para todos los dispositivos
- **Interfaz moderna** con Vue.js 3
- **Navegación intuitiva** entre secciones

---

## Estructura del Proyecto

```
Proyecto-fullstack/
├── backend/
│   ├── src/
│   │   ├── routes/          # Endpoints API
│   │   ├── middleware/      # Autenticación y validación
│   │   ├── models/          # Modelos de datos
│   │   ├── app.js          # Configuración Express
│   │   └── server.js       # Punto de entrada
│   ├── .env                # Variables de entorno
│   └── package.json        # Dependencias
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes Vue.js
│   │   ├── App.vue        # Componente principal
│   │   └── main.js        # Punto de entrada
│   ├── .env               # Variables de entorno
│   └── package.json       # Dependencias
├── documentacion_tecnica.txt
└── README.md
```

---

## Endpoints de la API

### Autenticación
- `GET /auth/google` - Iniciar OAuth con Google
- `GET /auth/github` - Iniciar OAuth con GitHub

### Usuarios
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `GET /usuarios/:id` - Obtener usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Gestión Académica
- `GET /alumnos` - Listar alumnos
- `GET /profesores` - Listar profesores
- `GET /clases` - Listar clases
- `GET /horarios` - Listar horarios

### APIs Externas
- `GET /weather/current/:city` - Clima actual
- `GET /weather/forecast/:city` - Pronóstico del clima
- `POST /api/pago` - Crear pago con Mercado Pago

---

## Desarrollo y Contribución

### Scripts Útiles
```bash
# Backend
cd backend
npm install          # Instalar dependencias
node src/server.js    # Iniciar servidor

# Frontend
cd frontend
npm install          # Instalar dependencias
npm run dev          # Modo desarrollo
npm run build        # Compilar para producción
```

### Flujo de Trabajo
1. Crear una rama para nuevas funcionalidades
2. Desarrollar y probar localmente
3. Crear pull request con descripción de cambios
4. Revisión y merge a la rama principal

---

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## Contacto

- **Repositorio**: https://github.com/Ussuin/Proyecto-fullstack
- **Issues**: Reportar problemas en GitHub
- **Documentación**: Ver `documentacion_tecnica.txt`
